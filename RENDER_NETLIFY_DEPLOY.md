# 🚀 EasyBid Deployment Guide - Render + Netlify

Complete step-by-step guide to deploy EasyBid backend on Render and frontend on Netlify.

## 📋 Prerequisites Checklist

Before starting deployment, ensure you have:

- [ ] GitHub account
- [ ] Render account (https://render.com - Free tier available)
- [ ] Netlify account (https://netlify.com - Free tier available)
- [ ] MongoDB Atlas account (https://mongodb.com/cloud/atlas - Free tier available)
- [ ] Gmail account for email notifications (or other SMTP provider)
- [ ] Code pushed to GitHub repository

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Build a Database"
   - Select FREE tier (M0)
   - Choose a cloud provider and region (closest to your backend region)
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `easybid`
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/easybid?retryWrites=true&w=majority`

---

## 📧 Step 2: Set Up Gmail for Email Notifications

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Security > 2-Step Verification
   - Enable if not already enabled

2. **Generate App Password**
   - Go to Google Account > Security
   - Under "2-Step Verification", find "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Name it "EasyBid Backend"
   - Click "Generate"
   - **Save the 16-character password** (you'll need this)

---

## 🖥️ Step 3: Deploy Backend to Render

### 3.1 Push Code to GitHub

```bash
cd c:/Users/User/OneDrive/Documents/Workspace/JavaScript/PROTOTYPE/REN/EASYBID
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 3.2 Create Render Web Service

1. **Sign in to Render**
   - Go to https://dashboard.render.com
   - Sign in or create account

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub repository
   - Select the EASYBID repository

3. **Configure Service**
   ```
   Name: easybid-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables**
   Click "Advanced" > "Add Environment Variable" and add these:

   ```
   NODE_VERSION = 20.11.0
   MONGO_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/easybid?retryWrites=true&w=majority
   JWT_SECRET = your-super-secure-secret-key-at-least-32-characters-long
   CLIENT_ORIGIN = (leave empty for now, we'll update after Netlify)
   FRONTEND_URL = (leave empty for now, we'll update after Netlify)
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASS = your-16-character-app-password
   NODE_ENV = production
   ```

   **Note:** Generate a secure JWT_SECRET using:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Once deployed, your backend URL will be: `https://easybid-backend.onrender.com`
   - **Save this URL!**

6. **Verify Backend**
   - Visit: `https://easybid-backend.onrender.com`
   - You should see: `{"ok":true,"message":"EasyBid backend running"}`

---

## 🌐 Step 4: Deploy Frontend to Netlify

### 4.1 Update netlify.toml

Before deploying, update the backend URL in `netlify.toml`:

```toml
[context.production.environment]
  VITE_API_URL = "https://easybid-backend.onrender.com/api" 
```

Commit and push:
```bash
git add netlify.toml
git commit -m "Update backend URL for Netlify"
git push
```

### 4.2 Deploy to Netlify

1. **Sign in to Netlify**
   - Go to https://app.netlify.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add new site" > "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your repositories
   - Select your EASYBID repository

3. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Add Environment Variables** (Optional)
   - Click "Site settings" > "Environment variables"
   - Add if needed:
   ```
   VITE_API_URL = https://easybid-backend.onrender.com/api
   VITE_APP_NAME = EasyBid Platform
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment (2-5 minutes)
   - Your site will be live at: `https://random-name-123456.netlify.app`
   - You can change the site name in settings

6. **Custom Domain (Optional)**
   - Go to "Site settings" > "Domain management"
   - Click "Add custom domain"
   - Follow instructions to add your domain

---

## 🔄 Step 5: Update Backend CORS Settings

Now that you have your Netlify URL, update the backend:

1. **Go to Render Dashboard**
   - Select your `easybid-backend` service
   - Go to "Environment" tab

2. **Update Environment Variables**
   ```
   CLIENT_ORIGIN = https://your-site-name.netlify.app
   FRONTEND_URL = https://your-site-name.netlify.app
   ```

3. **Save and Redeploy**
   - Click "Save Changes"
   - Render will automatically redeploy

---

## ✅ Step 6: Test Your Deployment

### 6.1 Test Backend API

```bash
# Check if backend is running
curl https://easybid-backend.onrender.com

# Should return: {"ok":true,"message":"EasyBid backend running"}
```

### 6.2 Test Frontend

1. Visit your Netlify URL: `https://your-site-name.netlify.app`
2. Try to register a new user
3. Log in with the user
4. Test creating a tender (as buyer)
5. Check if email notifications work

### 6.3 Create Admin User

SSH into Render or use a tool like Postman to create admin user:

```bash
# Using curl (replace URL with your backend URL)
curl -X POST https://easybid-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@easybid.com",
    "password": "SecurePassword123!",
    "role": "admin"
  }'
```

Or use MongoDB Compass to directly update a user's role to "admin".

---

## 🎯 Common Issues & Solutions

### Issue 1: Backend Not Connecting to MongoDB
**Solution:** 
- Verify MongoDB connection string is correct
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check username/password in connection string

### Issue 2: CORS Errors in Frontend
**Solution:**
- Ensure `CLIENT_ORIGIN` in Render matches your Netlify URL exactly
- No trailing slashes in URLs
- Redeploy backend after changing CORS settings

### Issue 3: Email Notifications Not Working
**Solution:**
- Verify Gmail app password is correct (16 characters, no spaces)
- Ensure 2FA is enabled on Gmail
- Check `EMAIL_USER` and `EMAIL_PASS` environment variables

### Issue 4: Frontend Can't Connect to Backend
**Solution:**
- Verify `VITE_API_URL` in netlify.toml is correct
- Ensure it ends with `/api` (e.g., `https://easybid-backend.onrender.com/api`)
- Redeploy frontend after changes

### Issue 5: Render Free Tier Sleeps
**Solution:**
- Render free tier sleeps after 15 minutes of inactivity
- First request will take 30-60 seconds to wake up
- Consider upgrading to paid tier for always-on service
- Or use a service like UptimeRobot to ping your backend every 14 minutes

---

## 🔐 Security Checklist

- [ ] MongoDB database user has strong password
- [ ] JWT_SECRET is randomly generated (32+ characters)
- [ ] Email app password is stored as environment variable
- [ ] `.env` files are in `.gitignore`
- [ ] CORS is properly configured for production
- [ ] MongoDB Network Access is configured (consider restricting to Render IPs)

---

## 📊 Monitoring & Maintenance

### Render Monitoring
- View logs: Render Dashboard > Your Service > Logs
- Check metrics: Dashboard > Metrics
- Set up email alerts in settings

### Netlify Monitoring
- View deploys: Netlify Dashboard > Deploys
- Check analytics: Dashboard > Analytics
- Set up deploy notifications

### MongoDB Monitoring
- Monitor usage: Atlas Dashboard > Metrics
- Set up alerts: Alerts tab
- Create backups: Backup tab

---

## 🚀 Deployment Complete!

Your EasyBid platform is now live! 

- **Frontend:** https://your-site-name.netlify.app
- **Backend:** https://easybid-backend.onrender.com
- **Database:** MongoDB Atlas

### Next Steps:
1. Create admin users
2. Test all functionality
3. Share with users
4. Monitor logs for any issues
5. Consider setting up custom domains

---

## 📞 Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB connection is working
5. Test API endpoints individually using Postman

---

## 🔄 Redeployment

### To redeploy backend:
```bash
git add .
git commit -m "Update backend"
git push
# Render will auto-deploy
```

### To redeploy frontend:
```bash
git add .
git commit -m "Update frontend"
git push
# Netlify will auto-deploy
```

### Manual Redeploy:
- **Render:** Dashboard > Your Service > Manual Deploy > Deploy latest commit
- **Netlify:** Dashboard > Deploys > Trigger deploy

---

**Congratulations! 🎉 Your EasyBid platform is deployed and ready to use!**
