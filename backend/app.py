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

@app.before_first_request
def init_db():
    db.create_all()

@app.route("/increment", methods=["POST"])
def increment():
    db.session.add(Visitor())
    db.session.commit()
    return jsonify({"count": Visitor.query.count()})

@app.route("/count", methods=["GET"])
def count():
    return jsonify({"count": Visitor.query.count()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
