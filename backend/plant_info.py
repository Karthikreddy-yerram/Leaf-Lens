import json
import os

DATA_PATH = os.path.join('data', 'plant_data.json')

DEFAULT_INFO = {
    "scientific_name": "N/A",
    "family": "N/A",
    "description": "No information found for this plant.",
    "medicinal_uses": [],
    "regions": [],
    "properties": {
        "Anti-inflammatory": "N/A",
        "Antioxidant": "N/A",
        "Medicinal value": "N/A",
        "Traditional use": "N/A"
    }
}

def get_plant_info(plant_name):
    
    try:
        with open(DATA_PATH, 'r', encoding='utf-8') as file:
            data = json.load(file)
            plant_info = data.get(plant_name, {})
            return {
                "scientific_name": plant_info.get("scientific_name", DEFAULT_INFO["scientific_name"]),
                "family": plant_info.get("family", DEFAULT_INFO["family"]),
                "description": plant_info.get("description", DEFAULT_INFO["description"]),
                "medicinal_uses": plant_info.get("medicinal_uses", DEFAULT_INFO["medicinal_uses"]),
                "regions": plant_info.get("regions", DEFAULT_INFO["regions"]),
                "properties": plant_info.get("properties", DEFAULT_INFO["properties"]),
            }
    except Exception as e:
        print(f"Error reading plant data: {e}")
        return {
            **DEFAULT_INFO,
            "description": "Error loading plant information."
        }
