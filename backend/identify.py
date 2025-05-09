import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os
import random

MODEL_PATH = os.path.join('model', 'medicinal_plants_xception.h5')

CLASS_LABELS = [
    "Aloevera", "Amla", "Amruta_Balli", "Arali", "Ashoka", "Astma_weed", "Badipala", "Balloon_Vine", "Bamboo", "Beans",
    "Betel", "Brahmi", "Bringaraja", "camphor", "Caricature", "Castor", "Catharanthus", "Chakte", "Chilly", 
    "Citron lime (herelikai)", "Coffee", "Common rue(naagdalli)", "Coriender", "Curry_Leaf", "Doddapatre", 
    "Drumstick", "Ekka", "Eucalyptus", "Ganigale", "Ganike", "Gasagase", "Ginger", "Globe Amarnath", "Guava", "Henna", 
    "Hibiscus", "Honge", "Insulin", "Jackfruit", "Jasmine", "kamakasturi", "Kambajala", "Kasambruga", "kepala", 
    "Kohlrabi", "Lantana", "Lemon", "Lemon_grass", "Malabar_Nut", "Malabar_Spinach", "Mango", "Marigold", "Mint", 
    "Neem", "Nelavembu", "Nerale", "Nooni", "Onion", "Padri", "Palak(Spinach)", "Pappaya", "Parijatha", "Pea", 
    "Pepper", "Pomegranate", "Pumpkin", "Raddish", "Rose", "Sampige", "Sapota", "Seethaashoka", "Seethapala", 
    "Spinach1", "Tamarind", "Taro", "Tecoma", "Thumbe", "Tomato", "Tulasi", "Turmeric"
]

model = None

def load_model_if_needed():
    
    global model
    if model is None:
        try:
            physical_devices = tf.config.list_physical_devices('GPU')
            if physical_devices:
                for device in physical_devices:
                    tf.config.experimental.set_memory_growth(device, True)
            
            model = tf.keras.models.load_model(MODEL_PATH, compile=False)
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise

def predict_plant(image_path):
    # MOCKED for demo: randomly select a label and confidence
    label = random.choice(CLASS_LABELS)
    confidence = round(random.uniform(0.7, 0.99), 2)
    return label, confidence
