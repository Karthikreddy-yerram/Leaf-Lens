import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from download_model import download_model

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
            download_model()  # Ensure model file is present
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
    
    try:
        load_model_if_needed()

        img = image.load_img(image_path, target_size=(224, 224))
        img_array = np.expand_dims(image.img_to_array(img) / 255.0, axis=0)

        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions)
        confidence = float(predictions[0][predicted_index])
        label = CLASS_LABELS[predicted_index]

        return label, confidence
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise
