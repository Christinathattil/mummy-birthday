#!/usr/bin/env python3
"""
Admin script to manage wishes via backend API.
Run this locally to edit/delete wishes - not exposed to frontend users.
"""

import requests
import json

# Use your Cloudflare Worker URL (resolves globally)
BACKEND_URL = "https://misty-boat-df06.christinajosthattil.workers.dev"

def list_wishes():
    """List all wishes with their IDs"""
    try:
        r = requests.get(f"{BACKEND_URL}/wishes")
        r.raise_for_status()
        wishes = r.json()
        print("\n=== Current Wishes ===")
        for wish in wishes:
            name_display = f" — {wish['name']}" if wish['name'] else ""
            print(f"ID {wish['id']}: {wish['text']}{name_display}")
        return wishes
    except Exception as e:
        print(f"Error fetching wishes: {e}")
        return []

def edit_wish(wish_id, new_text=None, new_name=None):
    """Edit a wish by ID"""
    data = {}
    if new_text is not None:
        data["text"] = new_text
    if new_name is not None:
        data["name"] = new_name
    
    if not data:
        print("No changes specified")
        return
    
    try:
        r = requests.put(f"{BACKEND_URL}/admin/wishes/{wish_id}", json=data)
        r.raise_for_status()
        result = r.json()
        print(f"✅ Updated wish {wish_id}: {result['text']}" + (f" — {result['name']}" if result['name'] else ""))
    except Exception as e:
        print(f"❌ Error updating wish {wish_id}: {e}")

def delete_wish(wish_id):
    """Delete a wish by ID"""
    try:
        r = requests.delete(f"{BACKEND_URL}/admin/wishes/{wish_id}")
        r.raise_for_status()
        result = r.json()
        print(f"✅ {result['message']}")
    except Exception as e:
        print(f"❌ Error deleting wish {wish_id}: {e}")

def main():
    print("🎂 Birthday Wish Admin Tool")
    print("=" * 40)
    
    while True:
        print("\nOptions:")
        print("1. List all wishes")
        print("2. Edit a wish")
        print("3. Delete a wish")
        print("4. Exit")
        
        choice = input("\nEnter choice (1-4): ").strip()
        
        if choice == "1":
            list_wishes()
        elif choice == "2":
            wishes = list_wishes()
            if not wishes:
                continue
            
            try:
                wish_id = int(input("\nEnter wish ID to edit: "))
                new_text = input("New text (leave blank to keep current): ").strip() or None
                new_name = input("New name (leave blank to keep current): ").strip() or None
                
                edit_wish(wish_id, new_text, new_name)
            except ValueError:
                print("❌ Invalid wish ID")
        elif choice == "3":
            wishes = list_wishes()
            if not wishes:
                continue
                
            try:
                wish_id = int(input("\nEnter wish ID to delete: "))
                confirm = input(f"Delete wish {wish_id}? (y/N): ").strip().lower()
                if confirm == 'y':
                    delete_wish(wish_id)
                else:
                    print("Cancelled")
            except ValueError:
                print("❌ Invalid wish ID")
        elif choice == "4":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice")

if __name__ == "__main__":
    main()
