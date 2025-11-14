# EasyBid Platform Deployment Guide

## 🚀 Railway Deployment (Recommended)

### Backend Deployment
1. **Create Railway Account**: Go to https://railway.app
2. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

3. **Login and Deploy Backend**:
   ```bash
   cd backend
   railway login
   railway init
   railway add --service mongodb
   railway deploy
   ```

4. **Configure Environment Variables**:
   - `MONGO_URI`: Automatically provided by Railway MongoDB
   - `JWT_SECRET`: Add your secret key
   - `FRONTEND_URL`: https://your-frontend-url.railway.app
   - `EMAIL_USER`: Your email for notifications
   - `EMAIL_PASS`: Your email app password

### Frontend Deployment
1. **Deploy Frontend**:
   ```bash
   cd frontend
   railway init
   railway deploy
   ```

2. **Update API Base URL** in frontend:
   - Set VITE_API_URL to your backend Railway URL

---

## 🌐 Alternative: Vercel + MongoDB Atlas

### MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string

### Backend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. In backend folder: `vercel`
3. Configure environment variables in Vercel dashboard

### Frontend (Vercel)
1. In frontend folder: `vercel`
2. Set VITE_API_URL to backend URL

---

## 🐳 Docker Deployment

### Full Stack with Docker Compose
```bash
# Build and run everything
docker-compose up --build
```

---

## 🔧 Heroku Deployment

### Backend
```bash
cd backend
heroku create easybid-backend
heroku addons:create mongolab:sandbox
git push heroku main
```

### Frontend
```bash
cd frontend
heroku create easybid-frontend
heroku buildpacks:set mars/create-react-app
git push heroku main
```

---

## ⚡ Quick Start with Railway
1. Fork/clone your repo to GitHub
2. Connect Railway to GitHub
3. Deploy both backend and frontend
4. Configure environment variables
5. Your app is live!

**Estimated Time**: 15-20 minutes for full deployment
**Cost**: Free tier available on all platforms