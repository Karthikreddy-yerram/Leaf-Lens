

from pymongo import MongoClient
import os
from dotenv import load_dotenv
import datetime
import uuid
try:
    import bcrypt
    BCRYPT_AVAILABLE = True
except ImportError:
    BCRYPT_AVAILABLE = False
    print("Warning: bcrypt is not installed. Password hashing will be minimal.")
from bson.objectid import ObjectId

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client["leaf_lens_db"]
    
    users = db["users"]
    plants = db["plants"]
    history = db["history"]
    
    users.create_index("email", unique=True)
    history.create_index("userId")

    MONGO_CONNECTED = True
    print("Successfully connected to MongoDB")
except Exception as e:
    MONGO_CONNECTED = False
    print(f"Failed to connect to MongoDB: {e}")
    print("Using fallback in-memory storage")
    users_data = []
    plants_data = []
    history_data = []

def hash_password(password):
    
    if BCRYPT_AVAILABLE:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    else:
        import hashlib
        return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(stored_password, provided_password):
    
    if BCRYPT_AVAILABLE:
        if isinstance(stored_password, str):
            return provided_password == stored_password
        return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)
    else:
        import hashlib
        hashed = hashlib.sha256(provided_password.encode('utf-8')).hexdigest()
        return hashed == stored_password

def setup_database():
    
    if not MONGO_CONNECTED:
        print("Using in-memory storage instead of MongoDB")
        return
        
    try:
        if users.count_documents({"email": "admin@leaflens.com"}) == 0:
            admin_password = hash_password("admin123")
            admin_user = {
                "email": "admin@leaflens.com",
                "password": admin_password,
                "role": "admin",
                "createdAt": datetime.datetime.now()
            }
            users.insert_one(admin_user)
            print("Admin user created")
        
        if plants.count_documents({}) == 0:
            sample_plants = [
                {
                    "name": "Tulsi (Holy Basil)",
                    "scientific_name": "Ocimum sanctum",
                    "family": "Lamiaceae",
                    "medicinal_properties": "Anti-inflammatory, Antibacterial, Adaptogenic",
                    "traditional_uses": "Used in Ayurveda for treating colds, coughs, and respiratory disorders",
                    "active_compounds": ["Eugenol", "Carvacrol", "Ursolic acid", "Rosmarinic acid"],
                    "preparation_methods": {
                        "Tea": "Steep leaves in hot water for 5 minutes",
                        "Tincture": "Extract in alcohol for 2-4 weeks",
                        "Powder": "Dry and grind leaves"
                    }
                },
                {
                    "name": "Neem",
                    "scientific_name": "Azadirachta indica",
                    "family": "Meliaceae",
                    "medicinal_properties": "Antimicrobial, Antidiabetic, Antiparasitic",
                    "traditional_uses": "Treatment of skin diseases, dental care, and as an insect repellent",
                    "active_compounds": ["Azadirachtin", "Nimbin", "Nimbidin", "Quercetin"],
                    "preparation_methods": {
                        "Oil": "Extract from seeds",
                        "Paste": "Grind leaves with water",
                        "Decoction": "Boil bark or leaves"
                    }
                }
            ]
            plants.insert_many(sample_plants)
            print("Sample plants added")
    except Exception as e:
        print(f"Error setting up database: {e}")

def create_user(email, password):
    
    if not MONGO_CONNECTED:
        user_id = str(uuid.uuid4())
        user = {
            "_id": user_id,
            "email": email,
            "password": hash_password(password),
            "role": "user",
            "createdAt": datetime.datetime.now()
        }
        users_data.append(user)
        return user_id
        
    try:
        hashed_password = hash_password(password)
        user = {
            "email": email,
            "password": hashed_password,
            "role": "user",
            "createdAt": datetime.datetime.now()
        }
        result = users.insert_one(user)
        return result.inserted_id
    except Exception as e:
        print(f"Error creating user: {e}")
        return None

def authenticate_user(email, password):
    
    if not MONGO_CONNECTED:
        for user in users_data:
            if user.get("email") == email and verify_password(user.get("password"), password):
                return user
        return None
        
    try:
        user = users.find_one({"email": email})
        if user and verify_password(user.get("password"), password):
            return user
        return None
    except Exception as e:
        print(f"Error authenticating user: {e}")
        return None

def store_reset_token(email, token, expiry):
    
    if not MONGO_CONNECTED:
        for user in users_data:
            if user.get("email") == email:
                user["reset_token"] = token
                user["reset_expiry"] = expiry
                return True
        return False
        
    try:
        users.update_one(
            {"email": email},
            {"$set": {"reset_token": token, "reset_expiry": expiry}}
        )
        return True
    except Exception as e:
        print(f"Error storing reset token: {e}")
        return False

def reset_password(email, token, new_password):
    
    if not MONGO_CONNECTED:
        now = datetime.datetime.now()
        for user in users_data:
            if (user.get("email") == email and 
                user.get("reset_token") == token and 
                user.get("reset_expiry", now) > now):
                
                user["password"] = hash_password(new_password)
                user.pop("reset_token", None)
                user.pop("reset_expiry", None)
                return True
        return False
        
    try:
        now = datetime.datetime.now()
        user = users.find_one({
            "email": email,
            "reset_token": token,
            "reset_expiry": {"$gt": now}
        })
        
        if not user:
            return False
        
        hashed_password = hash_password(new_password)
        users.update_one(
            {"email": email},
            {
                "$set": {"password": hashed_password},
                "$unset": {"reset_token": "", "reset_expiry": ""}
            }
        )
        return True
    except Exception as e:
        print(f"Error resetting password: {e}")
        return False

def save_plant_history(user_id, plant_data):
    
    if not MONGO_CONNECTED:
        history_id = str(uuid.uuid4())
        history_entry = {
            "_id": history_id,
            "id": history_id,
            "userId": user_id,
            "plantName": plant_data.get("plantName"),
            "confidence": plant_data.get("confidence"),
            "imageUrl": plant_data.get("imageUrl", ""),
            "info": plant_data.get("info", {}),
            "tts": plant_data.get("tts", ""),
            "timestamp": datetime.datetime.now()
        }
        history_data.append(history_entry)
        return history_id
        
    try:
        history_entry = {
            "userId": user_id,
            "plantName": plant_data.get("plantName"),
            "confidence": plant_data.get("confidence"),
            "imageUrl": plant_data.get("imageUrl", ""),
            "info": plant_data.get("info", {}),
            "tts": plant_data.get("tts", ""),
            "timestamp": datetime.datetime.now()
        }
        
        if "id" in plant_data:
            history_entry["id"] = plant_data["id"]
            
        result = history.insert_one(history_entry)
        
        history.update_one(
            {"_id": result.inserted_id},
            {"$set": {"id": str(result.inserted_id)}}
        )
        
        return result.inserted_id
    except Exception as e:
        print(f"Error saving plant history: {e}")
        return None

def get_user_history(user_id):
    
    if not MONGO_CONNECTED:
        user_history = [item for item in history_data if item.get("userId") == user_id]
        for item in user_history:
            item["_id"] = str(item["_id"])
        return user_history
        
    try:
        user_history = list(history.find({"userId": user_id}))
        for item in user_history:
            item["_id"] = str(item["_id"])
            if "id" not in item or not item["id"]:
                item["id"] = item["_id"]
        return user_history
    except Exception as e:
        print(f"Error getting user history: {e}")
        return []

def clear_user_history(user_id):
    
    if not MONGO_CONNECTED:
        global history_data
        count = len([item for item in history_data if item.get("userId") == user_id])
        history_data = [item for item in history_data if item.get("userId") != user_id]
        return count
        
    try:
        result = history.delete_many({"userId": user_id})
        return result.deleted_count
    except Exception as e:
        print(f"Error clearing user history: {e}")
        return 0

if MONGO_CONNECTED:
    setup_database() 