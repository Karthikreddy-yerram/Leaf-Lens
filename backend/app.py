from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import uuid
from identify import predict_plant
from translate import translate_plant_info
from tts import generate_tts
from werkzeug.utils import secure_filename
import base64
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.json_util import dumps
from bson.objectid import ObjectId
import time
import mongodb_setup as db

load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
AUDIO_FOLDER = "static/audio"
USERS_FILE = "users.json"
PLANT_INFO_FILE = os.path.join("data", "plant_data.json")
HISTORY_FOLDER = os.path.join("data", "history")
FEEDBACK_FOLDER = os.path.join("data", "feedback")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)
os.makedirs(HISTORY_FOLDER, exist_ok=True)
os.makedirs(FEEDBACK_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["leaf_lens_db"]
users_collection = db["users"]
plants_collection = db["plants"]
history_collection = db["history"]

users_collection.create_index("email", unique=True)
history_collection.create_index("userId")

if users_collection.count_documents({"email": "admin@leaflens.com"}) == 0:
    admin_user = {
        "email": "admin@leaflens.com",
        "password": "admin123",
        "role": "admin",
        "createdAt": datetime.datetime.now()
    }
    users_collection.insert_one(admin_user)
    print("Admin user created")

password_reset_tokens = {}

def send_reset_email(email, token):
    try:
        reset_url = f"http://localhost:3000/reset-password?token={token}"
        print(f"[DEV MODE] Password reset link for {email}: {reset_url}")
        
        return True
        
        
        
    except Exception as e:
        print(f"Email sending error: {str(e)}")
        return False

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_plant_info(label):
    try:
        with open(PLANT_INFO_FILE, "r", encoding="utf-8") as f:
            info_data = json.load(f)
        return info_data.get(label)
    except Exception as e:
        print(f"[Plant Info Error] {label}: {e}")
        return None

def authenticate_user(email, password):
    if not os.path.exists(USERS_FILE):
        return False
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        users = json.load(f)
    return any(u["email"] == email and u["password"] == password for u in users)

def save_image(file, entry_id):
    if file and allowed_file(file.filename):
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{entry_id}.{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        return filename
    return None

@app.route("/uploads/<filename>")
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return jsonify({"message": "All fields are required"}), 400

        users = []
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                users = json.load(f)

        if any(u["email"] == email for u in users):
            return jsonify({"message": "Email already exists"}), 409

        users.append({
            "username": username, 
            "email": email, 
            "password": password,
            "isAdmin": False
        })
        
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2)

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print(f"[Signup Error] {e}")
        return jsonify({"message": "Internal server error"}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        if not os.path.exists(USERS_FILE):
            return jsonify({"error": "Invalid email or password"}), 401

        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)

        user = next((u for u in users if u["email"] == email and u["password"] == password), None)
        
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
            
        user_response = {
            "username": user["username"],
            "email": user["email"],
            "isAdmin": user.get("isAdmin", False)
        }
            
        return jsonify({"message": "Login successful", "user": user_response}), 200

    except Exception as e:
        print(f"[Login Error] {e}")
        return jsonify({"error": "Failed to process login"}), 500

@app.route("/identify", methods=["POST"])
def identify_plant():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image = request.files["image"]
        language = request.form.get("language", "en")
        entry_id = str(uuid.uuid4())
        
        filename = save_image(image, entry_id)
        if not filename:
            return jsonify({"error": "Invalid image format"}), 400

        image_path = os.path.join(UPLOAD_FOLDER, filename)
        label, confidence = predict_plant(image_path)
        english_info = get_plant_info(label)

        if not english_info:
            return jsonify({"error": f"No info found for '{label}'"}), 404

        translated_info = translate_plant_info(english_info, language)
        audio_base64 = generate_tts(translated_info, language, is_full_info=True)

        image_url = f"http://localhost:5000/uploads/{filename}"

        return jsonify({
            "id": entry_id,
            "plantName": label,
            "confidence": confidence,
            "info": translated_info,
            "tts": audio_base64,
            "imageUrl": image_url
        })

    except Exception as e:
        print(f"[Identify Error] {e}")
        return jsonify({"error": "Failed to identify plant"}), 500

@app.route("/translate", methods=["POST"])
def translate():
    try:
        data = request.get_json()
        content = data.get("content")
        language = data.get("language", "en")

        if not content or not isinstance(content, dict):
            return jsonify({"error": "Missing or invalid content"}), 400

        translated = translate_plant_info(content, language)
        return jsonify(translated)

    except Exception as e:
        print(f"[Translate Error] {e}")
        return jsonify({"error": "Translation failed"}), 500

@app.route("/get_original_plant_info", methods=["POST"])
def get_original_plant_info():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        plant_name = data.get("plant_name")

        if not email or not password:
            return jsonify({"error": "Authentication required"}), 401

        if not authenticate_user(email, password):
            return jsonify({"error": "Invalid credentials"}), 401

        if not plant_name:
            return jsonify({"error": "Plant name is required"}), 400

        original_info = get_plant_info(plant_name)
        
        if not original_info:
            return jsonify({"error": f"No data found for plant: {plant_name}"}), 404
            
        return jsonify(original_info)

    except Exception as e:
        print(f"[Get Original Plant Info Error] {e}")
        return jsonify({"error": "Failed to get original plant info"}), 500

@app.route("/tts", methods=["POST"])
def tts():
    try:
        data = request.get_json()
        text = data.get("text", "")
        language = data.get("language", "en")
        info = data.get("info")

        if info and isinstance(info, dict):
            audio_base64 = generate_tts(info, language, is_full_info=True)
        elif text:
            audio_base64 = generate_tts(text, language)
        else:
            return jsonify({"error": "No input provided for TTS"}), 400

        if not audio_base64:
            return jsonify({"error": "TTS generation failed"}), 500

        return jsonify({"audioBase64": audio_base64})

    except Exception as e:
        print(f"[TTS Error] {e}")
        return jsonify({"error": "TTS failed"}), 500

@app.route("/save_history", methods=["POST"])
def save_history():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        plant_data = data.get("plant_data")

        if not email or not password or not isinstance(plant_data, dict):
            return jsonify({"error": "Missing or invalid fields"}), 400

        if not authenticate_user(email, password):
            return jsonify({"error": "Authentication failed"}), 401

        file_path = os.path.join(HISTORY_FOLDER, f"{email}.json")

        history = []
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                history = json.load(f)

        existing_id = plant_data.get("id")
        found_by_id = False
        plant_name = plant_data.get("plantName")

        updated_history = []
        for entry in history:
            if entry.get("id") == existing_id:
                found_by_id = True
                continue
            
            if plant_name and entry.get("plantName") == plant_name:
                continue
                
            updated_history.append(entry)
        
        if not found_by_id and not existing_id:
            plant_data["id"] = str(uuid.uuid4())

        updated_history.insert(0, plant_data)

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(updated_history, f, indent=2)

        return jsonify({"status": "saved", "history": updated_history}), 200

    except Exception as e:
        print(f"[Save History Error] {e}")
        return jsonify({"error": "Failed to save history"}), 500

@app.route("/get_history", methods=["POST"])
def get_history():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not authenticate_user(email, password):
            return jsonify({"error": "Authentication failed"}), 401

        file_path = os.path.join(HISTORY_FOLDER, f"{email}.json")
        if not os.path.exists(file_path):
            return jsonify([])

        with open(file_path, "r", encoding="utf-8") as f:
            history = json.load(f)
            
        default_time = "1970-01-01T00:00:00Z"
        history.sort(key=lambda x: x.get("timestamp", default_time), reverse=True)

        return jsonify(history)

    except Exception as e:
        print(f"[Get History Error] {e}")
        return jsonify({"error": "Failed to load history"}), 500

@app.route("/clear_history", methods=["POST"])
def clear_history():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not authenticate_user(email, password):
            return jsonify({"error": "Authentication failed"}), 401

        file_path = os.path.join(HISTORY_FOLDER, f"{email}.json")
        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({"status": "cleared"}), 200

    except Exception as e:
        print(f"[Clear History Error] {e}")
        return jsonify({"error": "Failed to clear history"}), 500

@app.route("/delete_entry", methods=["POST"])
def delete_entry():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        entry_id = data.get("entry_id")

        if not email or not password or not entry_id:
            return jsonify({"error": "Missing required fields"}), 400

        if not authenticate_user(email, password):
            return jsonify({"error": "Authentication failed"}), 401

        file_path = os.path.join(HISTORY_FOLDER, f"{email}.json")
        if not os.path.exists(file_path):
            return jsonify({"error": "History not found"}), 404

        with open(file_path, "r", encoding="utf-8") as f:
            history = json.load(f)

        updated_history = [entry for entry in history if entry.get("id") != entry_id]

        for ext in ALLOWED_EXTENSIONS:
            image_path = os.path.join(UPLOAD_FOLDER, f"{entry_id}.{ext}")
            if os.path.exists(image_path):
                os.remove(image_path)
                break

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(updated_history, f, indent=2)

        return jsonify({"status": "deleted", "history": updated_history}), 200

    except Exception as e:
        print(f"[Delete Entry Error] {e}")
        return jsonify({"error": "Failed to delete entry"}), 500

@app.route('/request_reset', methods=['POST'])
def request_reset():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        user_exists = False
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                users = json.load(f)
                user_exists = any(u["email"] == email for u in users)
        
        if not user_exists:
            return jsonify({"message": "If your email exists in our system, you will receive a password reset link"}), 200
        
        token = secrets.token_urlsafe(32)
        
        expiration = datetime.now() + timedelta(hours=1)
        password_reset_tokens[token] = {
            'email': email,
            'expiration': expiration
        }
        
        email_sent = send_reset_email(email, token)
        
        if email_sent:
            return jsonify({"message": "Password reset link sent successfully"}), 200
        else:
            return jsonify({"error": "Failed to send reset email"}), 500
            
    except Exception as e:
        print(f"Request reset error: {str(e)}")
        return jsonify({"error": "An error occurred during the password reset request"}), 500

@app.route('/validate_token', methods=['POST'])
def validate_token():
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({"error": "Token is required"}), 400
        
        token_data = password_reset_tokens.get(token)
        if not token_data:
            return jsonify({"error": "Invalid or expired token"}), 400
        
        if datetime.now() > token_data['expiration']:
            password_reset_tokens.pop(token, None)
            return jsonify({"error": "Token has expired"}), 400
        
        return jsonify({"valid": True}), 200
        
    except Exception as e:
        print(f"Token validation error: {str(e)}")
        return jsonify({"error": "An error occurred during token validation"}), 500

@app.route('/reset_password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('new_password')
        
        if not token or not new_password:
            return jsonify({"error": "Token and new password are required"}), 400
        
        token_data = password_reset_tokens.get(token)
        if not token_data:
            return jsonify({"error": "Invalid or expired token"}), 400
        
        if datetime.now() > token_data['expiration']:
            password_reset_tokens.pop(token, None)
            return jsonify({"error": "Token has expired"}), 400
        
        email = token_data['email']
        
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                users = json.load(f)
            
            for user in users:
                if user["email"] == email:
                    user["password"] = new_password
                    break
            
            with open(USERS_FILE, "w", encoding="utf-8") as f:
                json.dump(users, f, indent=2)
        
        password_reset_tokens.pop(token, None)
        
        return jsonify({"message": "Password reset successful"}), 200
        
    except Exception as e:
        print(f"Password reset error: {str(e)}")
        return jsonify({"error": "An error occurred during password reset"}), 500

@app.route('/delete_account', methods=['POST'])
def delete_account():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        confirmation = data.get('confirmation')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        if confirmation != 'DELETE':
            return jsonify({'message': 'Invalid confirmation code'}), 400
        
        if not os.path.exists(USERS_FILE):
            return jsonify({'message': 'User not found'}), 404
            
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)
        
        user_index = None
        for i, user in enumerate(users):
            if user["email"] == email:
                user_index = i
                break
                
        if user_index is None:
            return jsonify({'message': 'User not found'}), 404
            
        if users[user_index]["password"] != password:
            return jsonify({'message': 'Incorrect password'}), 401
        
        history_file = os.path.join(HISTORY_FOLDER, f"{email}.json")
        history_entries = []
        
        if os.path.exists(history_file):
            try:
                with open(history_file, 'r', encoding='utf-8') as f:
                    history_entries = json.load(f)
            except Exception as e:
                print(f"Error reading history file: {e}")
                
        for entry in history_entries:
            entry_id = entry.get('id')
            if entry_id:
                for ext in ALLOWED_EXTENSIONS:
                    image_path = os.path.join(UPLOAD_FOLDER, f"{entry_id}.{ext}")
                    if os.path.exists(image_path):
                        try:
                            os.remove(image_path)
                            print(f"Deleted image: {image_path}")
                        except Exception as e:
                            print(f"Error deleting image {image_path}: {e}")
        
        if os.path.exists(history_file):
            try:
                os.remove(history_file)
                print(f"Deleted history file: {history_file}")
            except Exception as e:
                print(f"Error deleting history file: {e}")
            
        for file in os.listdir(FEEDBACK_FOLDER):
            file_path = os.path.join(FEEDBACK_FOLDER, file)
            try:
                if os.path.isfile(file_path) and file.endswith('.json'):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        feedback = json.load(f)
                        if feedback.get('email') == email:
                            os.remove(file_path)
                            print(f"Deleted feedback file: {file_path}")
            except Exception as e:
                print(f"Error processing feedback file {file_path}: {e}")
        
        users.pop(user_index)
        
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2)
        
        return jsonify({'message': 'Account successfully deleted'}), 200
    
    except Exception as e:
        app.logger.error(f"Error deleting account: {str(e)}")
        return jsonify({'message': 'An error occurred during account deletion'}), 500

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    try:
        feedback_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        screenshot_filename = None
        
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            name = request.form.get('name', 'Anonymous')
            email = request.form.get('email', '')
            feedback_type = request.form.get('feedbackType', 'general')
            feedback_text = request.form.get('feedbackText', '')
            rating = request.form.get('rating', '0')
            
            if 'screenshot' in request.files:
                screenshot = request.files['screenshot']
                if screenshot and allowed_file(screenshot.filename):
                    ext = screenshot.filename.rsplit('.', 1)[1].lower()
                    screenshot_filename = f"feedback_{feedback_id}.{ext}"
                    screenshot.save(os.path.join(UPLOAD_FOLDER, screenshot_filename))
        else:
            data = request.get_json()
            name = data.get('name', 'Anonymous')
            email = data.get('email', '')
            feedback_type = data.get('feedbackType', 'general')
            feedback_text = data.get('feedbackText', '')
            rating = data.get('rating', 0)
        
        try:
            rating = int(rating)
        except (ValueError, TypeError):
            rating = 0
            
        if not feedback_text:
            return jsonify({'error': 'Feedback text is required'}), 400
        
        feedback_entry = {
            'id': feedback_id,
            'name': name,
            'email': email,
            'type': feedback_type,
            'text': feedback_text,
            'rating': rating,
            'timestamp': timestamp,
            'status': 'new'
        }
        
        if screenshot_filename:
            feedback_entry['screenshot'] = screenshot_filename
            feedback_entry['screenshot_url'] = f"http://localhost:5000/uploads/{screenshot_filename}"
        
        feedback_file = os.path.join(FEEDBACK_FOLDER, f"{feedback_id}.json")
        with open(feedback_file, 'w', encoding='utf-8') as f:
            json.dump(feedback_entry, f, indent=2)
            
        
        return jsonify({'message': 'Feedback submitted successfully', 'id': feedback_id}), 201
        
    except Exception as e:
        print(f"Feedback submission error: {str(e)}")
        return jsonify({'error': 'An error occurred while submitting feedback'}), 500

@app.route('/update_profile', methods=['POST'])
def update_profile():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        if not os.path.exists(USERS_FILE):
            return jsonify({'message': 'User not found'}), 404
            
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)
        
        user = next((u for u in users if u["email"] == email), None)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user["password"] != password:
            return jsonify({'message': 'Authentication failed'}), 401
        
        user["username"] = username
        
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2)
        
        return jsonify({'message': 'Profile updated successfully'}), 200
    
    except Exception as e:
        app.logger.error(f"Error updating profile: {str(e)}")
        return jsonify({'message': 'An error occurred while updating profile'}), 500

@app.route('/change_password', methods=['POST'])
def change_password():
    try:
        data = request.json
        email = data.get('email')
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not email or not current_password or not new_password:
            return jsonify({'message': 'Email, current password, and new password are required'}), 400
        
        if not os.path.exists(USERS_FILE):
            return jsonify({'message': 'User not found'}), 404
            
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)
        
        user = next((u for u in users if u["email"] == email), None)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user["password"] != current_password:
            return jsonify({'message': 'Current password is incorrect'}), 401
        
        user["password"] = new_password
        
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2)
        
        return jsonify({'message': 'Password changed successfully'}), 200
    
    except Exception as e:
        app.logger.error(f"Error changing password: {str(e)}")
        return jsonify({'message': 'An error occurred while changing password'}), 500

@app.route('/update_settings', methods=['POST'])
def update_settings():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        settings = data.get('settings', {})
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        if not os.path.exists(USERS_FILE):
            return jsonify({'message': 'User not found'}), 404
            
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)
        
        user = next((u for u in users if u["email"] == email), None)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user["password"] != password:
            return jsonify({'message': 'Authentication failed'}), 401
        
        user["settings"] = settings
        
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2)
        
        return jsonify({'message': 'Settings updated successfully'}), 200
    
    except Exception as e:
        app.logger.error(f"Error updating settings: {str(e)}")
        return jsonify({'message': 'An error occurred while updating settings'}), 500

@app.route("/admin/users", methods=["POST"])
def get_all_users():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"error": "Authentication required"}), 401
            
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)
            
        admin_user = next((u for u in users if u["email"] == email and u["password"] == password and u.get("isAdmin", False) == True), None)
        
        if not admin_user:
            return jsonify({"error": "Unauthorized access"}), 403
            
        user_list = [{"username": u["username"], "email": u["email"], "isAdmin": u.get("isAdmin", False)} for u in users]
        return jsonify({"users": user_list}), 200
        
    except Exception as e:
        print(f"[Admin/Users Error] {e}")
        return jsonify({"error": "Failed to fetch users"}), 500

@app.route("/admin/update-user", methods=["POST"])
def update_user_admin_status():
    try:
        data = request.get_json()
        admin_email = data.get("adminEmail")
        admin_password = data.get("adminPassword")
        target_email = data.get("targetEmail")
        is_admin = data.get("isAdmin", False)
        
        if not admin_email or not admin_password or not target_email:
            return jsonify({"error": "Required fields missing"}), 400
            
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)
            
        admin_user = next((u for u in users if u["email"] == admin_email and u["password"] == admin_password and u.get("isAdmin", False) == True), None)
        
        if not admin_user:
            return jsonify({"error": "Unauthorized access"}), 403
            
        target_user = next((u for u in users if u["email"] == target_email), None)
        if not target_user:
            return jsonify({"error": "User not found"}), 404
            
        target_user["isAdmin"] = is_admin
        
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2)
            
        return jsonify({"message": "User updated successfully"}), 200
        
    except Exception as e:
        print(f"[Admin/Update User Error] {e}")
        return jsonify({"error": "Failed to update user"}), 500

if __name__ == "__main__":
    app.run(debug=True)
