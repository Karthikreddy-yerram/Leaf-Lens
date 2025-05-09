# download_model.py
import os
import requests

MODEL_URL = "https://drive.google.com/uc?export=download&id=1jt3wC0rqsP6qL49yOXh1cyrUlpN4eKPF"
MODEL_PATH = os.path.join("model", "medicinal_plants_xception.h5")

def download_model():
    if not os.path.exists(MODEL_PATH):
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        print("⬇️ Downloading model from Google Drive...")
        with requests.get(MODEL_URL, stream=True) as r:
            r.raise_for_status()
            with open(MODEL_PATH, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        print("✅ Model downloaded successfully.")
    else:
        print("✅ Model already exists. Skipping download.")
