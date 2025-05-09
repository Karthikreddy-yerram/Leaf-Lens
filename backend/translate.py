from googletrans import Translator
import re

translator = Translator()

def translate_text(text, target_lang):
    
    try:
        if not text or not isinstance(text, str) or not text.strip() or target_lang == 'en':
            return text
        
        processed_text = text
        
        translated = translator.translate(processed_text, dest=target_lang)
        result = translated.text
        
        return result
    except Exception as e:
        print(f"[Translation Error] Text: {text}, Error: {e}")
        return text


def clean_translated_text(text, target_lang):
    
    if not text or not isinstance(text, str) or target_lang == 'en':
        return text
        
    english_patterns = [
        r'\bInal\b', r'\binal\b', r'\bvalue\b', r'\buse\b', r'\buses\b', 
        r'\bmedium\b', r'\blow\b', r'\bhigh\b', r'\banti\b', r'\binflammatory\b',
        r'\bantioxidant\b', r'\btraditional\b', r'\bmedicinal\b', r'\bmediclidalled\b',
        r'\bMediclidalled\b', r'\bUses\b'
    ]
    
    needs_cleaning = False
    for pattern in english_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            needs_cleaning = True
            break
            
    if needs_cleaning:
        try:
            translated = translator.translate(text, dest=target_lang)
            return translated.text
        except Exception as e:
            print(f"[Cleaning Error] Text: {text}, Error: {e}")
    
    return text


def translate_plant_info(info, target_lang):
    
    if not info or not isinstance(info, dict) or target_lang == 'en':
        return info

    translated_info = {}

    processed_info = {}
    for key, value in info.items():
        new_key = key.replace('Inal', 'Plant').replace('inal', 'plant')
        
        if isinstance(value, str):
            processed_info[new_key] = value.replace('Inal', 'Plant').replace('inal', 'plant')
        elif isinstance(value, dict):
            new_dict = {}
            for prop_key, prop_value in value.items():
                new_prop_key = prop_key.replace('Inal', 'Plant').replace('inal', 'plant')
                if isinstance(prop_value, str):
                    new_dict[new_prop_key] = prop_value.replace('Inal', 'Plant').replace('inal', 'plant')
                else:
                    new_dict[new_prop_key] = prop_value
            processed_info[new_key] = new_dict
        elif isinstance(value, list):
            new_list = []
            for item in value:
                if isinstance(item, str):
                    new_list.append(item.replace('Inal', 'Plant').replace('inal', 'plant'))
                else:
                    new_list.append(item)
            processed_info[new_key] = new_list
        else:
            processed_info[new_key] = value

    try:
        key_labels = {
            "scientific_name": "Scientific Name", 
            "scientificName": "Scientific Name",
            "scientific_label": "Scientific Name",
            "family": "Family",
            "description": "Description",
            "medicinal_uses": "Medicinal Uses",
            "medicinalUses": "Medicinal Uses",
            "mediclidalled_uses": "Medicinal Uses",
            "Mediclidalled Uses": "Medicinal Uses",
            "regions": "Regions",
            "properties": "Properties",
            "Anti-inflammatory": "Anti-inflammatory",
            "Antioxidant": "Antioxidant",
            "Medicinal value": "Medicinal value",
            "Traditional use": "Traditional use",
            "Plant pada value": "Plant pada value",
            "குடுமிப்பட்டு பயன்படுத்தல்": "Traditional use",
            "Mediclidalled Uses": "Medicinal Uses"
        }

        for key, value in processed_info.items():
            display_key = key_labels.get(key, key)
            translated_key = translate_text(display_key, target_lang)
            translated_key = clean_translated_text(translated_key, target_lang)
            
            if isinstance(value, str):
                translated_value = translate_text(value, target_lang)
                translated_info[translated_key] = clean_translated_text(translated_value, target_lang)
            elif isinstance(value, list):
                translated_list = []
                for item in value:
                    if isinstance(item, str):
                        translated_item = translate_text(item, target_lang)
                        translated_list.append(clean_translated_text(translated_item, target_lang))
                    else:
                        translated_list.append(item)
                translated_info[translated_key] = translated_list
            elif isinstance(value, dict):
                translated_dict = {}
                for prop_key, prop_value in value.items():
                    if ' ' in prop_key:
                        parts = prop_key.split(' ')
                        translated_parts = [translate_text(part, target_lang) for part in parts]
                        translated_prop_key = ' '.join(translated_parts)
                    else:
                        translated_prop_key = translate_text(prop_key, target_lang)
                    
                    translated_prop_key = clean_translated_text(translated_prop_key, target_lang)
                    
                    if isinstance(prop_value, str):
                        translated_prop_value = translate_text(prop_value, target_lang)
                        translated_dict[translated_prop_key] = clean_translated_text(translated_prop_value, target_lang)
                    else:
                        translated_dict[translated_prop_key] = prop_value
                
                translated_info[translated_key] = translated_dict
            else:
                translated_info[translated_key] = value

    except Exception as e:
        print(f"[Translation Error] Failed to translate plant info: {e}")
        return info

    try:
        final_info = {}
        for key, value in translated_info.items():
            final_key = clean_translated_text(key, target_lang)
            
            if isinstance(value, dict):
                final_dict = {}
                for prop_key, prop_value in value.items():
                    final_prop_key = clean_translated_text(prop_key, target_lang)
                    
                    if isinstance(prop_value, str):
                        final_dict[final_prop_key] = clean_translated_text(prop_value, target_lang)
                    else:
                        final_dict[final_prop_key] = prop_value
                final_info[final_key] = final_dict
            elif isinstance(value, list):
                final_list = []
                for item in value:
                    if isinstance(item, str):
                        final_list.append(clean_translated_text(item, target_lang))
                    else:
                        final_list.append(item)
                final_info[final_key] = final_list
            elif isinstance(value, str):
                final_info[final_key] = clean_translated_text(value, target_lang)
            else:
                final_info[final_key] = value
        
        return final_info
    except Exception as e:
        print(f"[Final Cleanup Error]: {e}")
        return translated_info
