# Leaf-Lens

Leaf-Lens is a medicinal plant identification project that uses deep learning to classify plant images. The backend is powered by TensorFlow and a pre-trained Xception model, while the frontend is built with Next.js.

## Features
- Identify medicinal plants from images
- Provides plant information and medicinal uses
- Handles large model files automatically

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd Leaf-Lens
   ```

2. **Install backend dependencies:**
   ```sh
   cd backend
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies:**
   ```sh
   cd ../frontend
   npm install
   ```

4. **Run the backend:**
   ```sh
   cd ../backend
   python app.py
   ```

5. **Run the frontend:**
   ```sh
   cd ../frontend
   npm run dev
   ```

## Model File Handling
- The model file (`backend/model/medicinal_plants_xception.h5`) is **not included in the repository** due to its large size.
- When you run the backend, the model file will be **automatically downloaded** from Google Drive if it does not exist.
- The download logic is handled in `backend/download_model.py` and is called from `backend/identify.py`.

## Notes
- Make sure you have Python 3.7+ and Node.js installed.
- The `.gitignore` is configured to prevent large model files from being committed.

## License
MIT License 