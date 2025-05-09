# Leaf Lens Demo (Free Hosting Version)

## Overview
This project is a demo version of Leaf Lens, featuring a Next.js frontend and a Flask backend. The backend's plant identification model is mocked for free hosting compatibility. You can deploy both frontend and backend for free using Vercel (frontend) and Render/Railway (backend).

---

## 1. Push Project to GitHub

1. **Initialize Git (if not already):**
   ```sh
   git init
   ```
2. **Add all files:**
   ```sh
   git add .
   ```
3. **Commit your changes:**
   ```sh
   git commit -m "Initial commit"
   ```
4. **Create a new repository on GitHub.**
5. **Add the remote:**
   ```sh
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```
6. **Push to GitHub:**
   ```sh
   git push -u origin main
   ```

---

## 2. Deploy Backend (Flask) for Free

### Recommended: [Render](https://render.com/) or [Railway](https://railway.app/)

1. **Create a new Web Service** and connect your GitHub repo.
2. **Set build and start commands:**
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `python backend/app.py`
3. **Set environment variables:**
   - `MONGO_URI` (use [MongoDB Atlas Free Tier](https://www.mongodb.com/atlas/database))
4. **Deploy!**

---

## 3. Deploy Frontend (Next.js) for Free

### Recommended: [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)

1. **Connect your GitHub repo.**
2. **Set build settings:**
   - **Build Command:** `npm run build` or `pnpm build`
   - **Output Directory:** `.next`
3. **Set environment variables:**
   - `NEXT_PUBLIC_API_URL` (URL of your deployed backend)
4. **Deploy!**

---

## 4. Notes
- The backend's plant identification is mocked for demo purposes (no real ML inference).
- The large model file is excluded from GitHub and deployment.
- For production, use a paid backend with GPU and restore the real model.

---

## 5. Local Development

### Backend
```sh
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```sh
npm install
npm run dev
```

---

## 6. License
MIT 