# 🌿 Leaf-Lens: Medicinal Plant Identification and Information Insight

Leaf-Lens is a full-stack ML-powered application that identifies 80 Indian medicinal plants from leaf images using deep learning. It offers multilingual support, text-to-speech capability, and structured plant reports—bridging traditional medicinal knowledge with modern AI.

---

## 📌 Project Highlights

- 🔍 Identify 80 Indian medicinal plants via image recognition (Xception Model)
- 🌐 Multilingual output in 15 languages
- 🔊 Audio output using text-to-speech
- 📈 View history, plant usage, scientific data
- 💻 Full-stack architecture: Flask backend + Next.js frontend
- 🧠 Model accuracy: **93.24%**

---

## 🚩 Problem Statement

Manual identification of medicinal plants is slow, requires expert knowledge, and lacks automation. Existing models struggle with poor image quality, limited species, and no real-time or multilingual support. Leaf-Lens addresses all of these limitations.

---

## ✅ Proposed Solution

- 📸 Deep Learning with Xception model (transfer learning from ImageNet)
- 🧪 Data augmentation & two-phase training for robustness
- 🔁 Multiclass softmax classification
- 🗣️ Translation (googletrans) + Speech synthesis (gTTS)
- 🌍 Scalable frontend with dark mode and interactive dashboards

---

## 🧠 Model Overview

| Parameter | Value |
|----------|--------|
| Model | Xception |
| Dataset | 6,904 RGB leaf images (80 classes) |
| Input Size | 224×224 |
| Accuracy | **93.24%** |
| Augmentation | Rotation, Zoom, Flip, Shear |
| Optimizer | Adam (lr=1e-4 → 1e-5) |
| Training Phases | Frozen base → Fine-tuned base |
| Framework | TensorFlow, Keras |

---

## 🧪 Core Features

- 🌿 Leaf image upload with instant prediction
- 🌍 15-language translation (dropdown select)
- 🔊 Audio output of translated result
- 📜 Auto-generated plant reports (uses, regions, family, etc.)
- 🧾 History tracking via localStorage
- 🌗 Dark mode toggle
- 📊 Admin and User Dashboards

---

## 📦 Tech Stack

| Layer       | Tools/Tech |
|-------------|------------|
| Frontend    | Next.js, React 19+, Tailwind CSS, Framer Motion |
| Backend     | Python, Flask, TensorFlow, gTTS, googletrans |
| Database    | MongoDB |
| Versioning  | Git, GitHub |
| Model File  | Xception-based `.h5` file (auto-download) |

---

##📁 Model File Handling
The trained model file is not included in the repository due to its size.

When you run the backend, the model will be automatically downloaded from Google Drive if it doesn’t exist.

The download logic is located in backend/download_model.py, invoked by identify.py.

##💡 Notes
Python 3.7+ and Node.js (LTS) must be installed.

.gitignore prevents large model files from being committed.

The app works best on modern browsers with stable GPU acceleration for training (if needed).

##📈 Sample Results
✅ Uploaded Image → Real-time prediction: Aloe vera

📜 Report: Uses, Regions, Family, Scientific Name

🌍 Translated into Telugu, Hindi, Kannada, Tamil, etc.

🔊 Read aloud in user's language

🧾 View past identifications in Dashboard

##🔮 Future Scope
📱 Mobile app with TensorFlow Lite

🌱 Add support for endangered/global plant species

🦠 Leaf disease detection via CNN

🌿 Multi-part recognition: leaf, flower, root

🤝 User contributions with moderation/authentication



## 🏗 Folder Structure (Simplified)
leaf-lens/
├── backend/
│ ├── app.py # Main Flask API
│ ├── identify.py # Model prediction logic
│ ├── download_model.py # Auto-download model from Google Drive
│ ├── model/
│ │ └── medicinal_plants_xception.h5 # (auto-downloaded if missing)
│ ├── utils/ # gTTS, translator
│ └── requirements.txt
├── frontend/
│ ├── app/identify/ # Upload, prediction page
│ ├── components/ # UI elements
│ └── public/ # Icons, leaf images
└── README.md

## ⚙️ Setup Instructions

### Clone the repository:
```bash
git clone <your-repo-url>
cd Leaf-Lens
Install backend dependencies:

cd backend
pip install -r requirements.txt

Install frontend dependencies:

cd ../frontend
npm install

Run the backend:

cd ../backend
python app.py

Run the frontend:

cd ../frontend
npm run dev
