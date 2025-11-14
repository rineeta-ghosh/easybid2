# 🚀 Simple Free Deployment Guide

## Option 1: Netlify (Recommended for Frontend) ⭐

### Step 1: Prepare Frontend for Deployment
1. **Update API URL** in frontend/.env:
   ```env
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

2. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

### Step 2: Deploy to Netlify
1. Go to https://netlify.com and sign up with GitHub
2. Click "New site from Git"
3. Connect your GitHub repository
4. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: `frontend`
5. Click "Deploy site"

### Step 3: Configure Environment Variables in Netlify
- Go to Site settings → Environment variables
- Add: `VITE_API_URL` = your backend URL

---

## Option 2: Vercel (Alternative)

### Deploy Frontend to Vercel
1. Go to https://vercel.com and sign up with GitHub
2. Click "New Project"
3. Import your GitHub repo
4. Set Framework Preset to "Vite"
5. Set Root Directory to `frontend`
6. Add environment variable: `VITE_API_URL`
7. Deploy!

---

## Backend: Railway (Free Tier)

### Step 1: Deploy Backend
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose "backend" folder as root directory
6. Railway will auto-detect Node.js and deploy

### Step 2: Add MongoDB
1. In Railway dashboard, click "New" → "Database" → "Add MongoDB"
2. Railway will automatically set MONGO_URI environment variable

### Step 3: Set Environment Variables
In Railway dashboard, add:
```
JWT_SECRET=your-secret-key-here
FRONTEND_URL=https://your-netlify-site.netlify.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## Alternative Backend: Render (Also Free)

1. Go to https://render.com
2. Connect GitHub
3. Create "Web Service"
4. Select your repo, set root directory to `backend`
5. Build command: `npm install`
6. Start command: `node src/server.js`
7. Add environment variables

---

## 🎯 Super Quick Setup (5 minutes)

1. **Push code to GitHub**
2. **Deploy frontend**: Connect Netlify to GitHub repo
3. **Deploy backend**: Connect Railway to same GitHub repo
4. **Add database**: Click "Add MongoDB" in Railway
5. **Set environment variables**: Add API URL in Netlify, email settings in Railway
6. **Done!** Your app is live and free!