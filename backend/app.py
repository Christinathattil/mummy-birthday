from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
# SQLite DB placed in project root; for production switch to Postgres / MySQL
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///visitors.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
CORS(app)

class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)

class Wish(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(60))
    created = db.Column(db.DateTime, server_default=db.func.now())

with app.app_context():
    db.create_all()

@app.route("/increment", methods=["POST","OPTIONS"])
def increment():
    db.session.add(Visitor())
    db.session.commit()
    return jsonify({"count": Visitor.query.count()})

@app.route("/count", methods=["GET"])
def count():
    return jsonify({"count": Visitor.query.count()})

# ==== Wishes ====
@app.route("/wishes", methods=["GET"])
def get_wishes():
    wishes = Wish.query.order_by(Wish.created).all()
    return jsonify([{"id": w.id, "text": w.text, "name": w.name or ""} for w in wishes])

@app.route("/wishes", methods=["POST","OPTIONS"])
def add_wish():
    data = request.get_json(force=True)
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "text required"}), 400
    name = data.get("name", "").strip()
    wish = Wish(text=text[:200], name=name[:60])
    db.session.add(wish)
    db.session.commit()
    return jsonify({"id": wish.id, "text": wish.text, "name": wish.name or ""}), 201

# ==== Admin-only wish management (backend only) ====
@app.route("/admin/wishes/<int:wish_id>", methods=["PUT"])
def edit_wish(wish_id):
    wish = Wish.query.get_or_404(wish_id)
    data = request.get_json(force=True)
    
    # Update text if provided
    if "text" in data:
        new_text = data["text"].strip()
        if not new_text:
            return jsonify({"error": "text cannot be empty"}), 400
        wish.text = new_text[:200]
    
    # Update name if provided (can be empty string)
    if "name" in data:
        new_name = data["name"].strip()
        wish.name = new_name[:60] if new_name else None
    
    db.session.commit()
    return jsonify({"id": wish.id, "text": wish.text, "name": wish.name or ""})

@app.route("/admin/wishes/<int:wish_id>", methods=["DELETE"])
def delete_wish(wish_id):
    wish = Wish.query.get_or_404(wish_id)
    db.session.delete(wish)
    db.session.commit()
    return jsonify({"message": f"Wish {wish_id} deleted successfully"})

import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
