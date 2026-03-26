# 🌾 Farm AI — CropSupport (MERN Stack)

> **AI-Powered Agricultural Intelligence Platform**  
> Built with MongoDB · Express · React · Node.js

---

## 📁 Project Structure

```
CropSupport/
├── backend/           ← Node.js + Express + MongoDB API
│   ├── server.js      ← Main server entry point
│   ├── .env           ← API keys (YOU MUST EDIT THIS)
│   ├── config/        ← MongoDB connection
│   ├── models/        ← Mongoose schemas (User, Query, DiseaseReport, CommunityPost)
│   ├── middleware/    ← JWT auth middleware
│   └── routes/        ← All API routes
│
└── frontend/          ← React + Vite frontend
    ├── index.html     ← HTML root
    ├── src/
    │   ├── App.jsx       ← Routes & auth guards
    │   ├── api.js        ← All API calls
    │   ├── index.css     ← Complete CSS styles
    │   ├── context/      ← AuthContext (login/register/logout)
    │   ├── components/   ← Layout, Sidebar
    │   └── pages/        ← Home, Auth, Dashboard, Chatbot, Disease, Weather, Community
    └── vite.config.js ← Vite config (proxies /api → backend)
```

---

## 🚀 COMPLETE SETUP GUIDE

### STEP 1 — Install Node.js

Download and install Node.js v18+ from: https://nodejs.org

Verify: `node --version` should show v18 or higher.

---

### STEP 2 — Set Up MongoDB

#### Option A: MongoDB Atlas (FREE Cloud DB — Recommended)
1. Go to https://cloud.mongodb.com
2. Create a free account → Create a **Free Cluster (M0)**
3. Click **Connect** → **Drivers** → Copy the connection string
4. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/farmai`

#### Option B: Local MongoDB
1. Download MongoDB Community: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. URI will be: `mongodb://localhost:27017/farmai`

---

### STEP 3 — Get FREE Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google → Click **"Create API Key"**
3. Copy the key (starts with `AIzaSy...`)

---

### STEP 4 — Configure Backend `.env`

Edit file: `backend/.env`

```env
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/farmai
JWT_SECRET=any_long_random_secret_string_here
GEMINI_API_KEY=AIzaSyYour_actual_api_key_here
PORT=5000
```

---

### STEP 5 — Start the Backend

Open **Terminal 1** in the `backend/` folder:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🌾 Farm AI Server running on http://localhost:5000
```

---

### STEP 6 — Start the Frontend

Open **Terminal 2** in the `frontend/` folder:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

### STEP 7 — Open in Browser

Go to: **http://localhost:5173**

---

## 🎯 Demo Walkthrough

### 1. Landing Page (http://localhost:5173)
- Full Farm AI marketing website
- Hero section, features, testimonials, stats, CTA

### 2. Register `/auth`
- Click **"Get Started Free"** or **"Create Account"**
- Fill: Name, Username, Password
- **Location is important!** e.g., `Punjab, India` or `Maharashtra, India`
- This personalizes ALL AI responses

### 3. Dashboard `/dashboard`
- See greeting with your name and location
- Today's weather advisory
- Quick action cards

### 4. AI Advisor `/ai`
- Try asking:
  - *"What crops should I plant this month?"*
  - *"How do I treat aphids on my tomato plants?"*
  - *"Best organic fertilizer for wheat?"*

### 5. Crop Disease Detection `/disease`
- Upload any plant/leaf photo
- Real Gemini AI diagnoses the disease
- Get treatment advice with bullet points

### 6. Weather `/weather`
- Current temperature + condition
- 5-day forecast
- AI farming recommendations

### 7. Community `/community`
- Browse posts from farmers
- Click **"+ Share a Post"** to create your own

---

## 🔌 Backend API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/ai/chat` | Ask AI a question | Yes |
| GET | `/api/ai/history` | Past AI conversations | Yes |
| POST | `/api/disease/detect` | Upload image for diagnosis | Yes |
| GET | `/api/disease/history` | Past crop scans | Yes |
| GET | `/api/weather` | Get weather + advisory | Yes |
| GET | `/api/community` | List all posts | No |
| POST | `/api/community` | Create a post | Yes |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 (JSX) + Vite |
| **Styling** | Pure HTML + Vanilla CSS |
| **Routing** | React Router DOM v6 |
| **Backend** | Node.js + Express 4 |
| **Database** | MongoDB + Mongoose |
| **AI Engine** | Google Gemini 1.5 Flash |
| **Auth** | JWT + Bcrypt |
| **File Upload** | Multer |
| **Toast** | react-hot-toast |
| **Markdown** | react-markdown |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot connect to MongoDB` | Check `MONGO_URI` in `backend/.env`. Whitelist your IP in MongoDB Atlas |
| `AI response failed` | Check `GEMINI_API_KEY` in `backend/.env` |
| `CORS error` | Make sure backend runs on port 5000 and frontend on 5173 |
| `Port in use` | Change `PORT=5001` in `.env`, visit `http://localhost:5001` |
| Frontend shows blank | Run `npm install` in `frontend/` folder |

---

## 📋 Quick Commands

```bash
# Backend (from CropSupport/backend/)
npm run dev        # Start with auto-reload (nodemon)
npm start          # Start without auto-reload

# Frontend (from CropSupport/frontend/)
npm run dev        # Start dev server
npm run build      # Build for production
```

---

<div align="center">
  <strong>🌾 Farm AI — Cultivating the Future of Smart Farming</strong><br/>
  Built with MERN Stack | Powered by Google Gemini AI
</div>
