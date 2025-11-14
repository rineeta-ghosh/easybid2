# ✅ EasyBid Pre-Deployment Checklist

Complete this checklist before deploying to ensure smooth deployment.

## 📦 Code Preparation

### Backend
- [x] `package.json` has correct `start` script: `node src/server.js`
- [x] `.env.example` contains all required environment variables
- [x] `.gitignore` excludes sensitive files (`.env`, `node_modules`, `uploads`, etc.)
- [x] CORS configured to accept production frontend URL
- [x] MongoDB connection uses environment variable
- [x] Email service configured with environment variables
- [ ] All API endpoints tested locally

### Frontend
- [x] `package.json` has `build` script: `vite build`
- [x] `.env.example` contains all required variables
- [x] API URL configured via environment variable (`VITE_API_URL`)
- [x] `.gitignore` includes `.env` and build artifacts
- [ ] Build tested locally (`npm run build`)
- [ ] All pages/routes work correctly

## 🔐 Security & Configuration

### Environment Variables Needed

#### Backend (Render)
```
NODE_VERSION = 20.11.0
MONGO_URI = mongodb+srv://...
JWT_SECRET = (generate random 32+ char string)
CLIENT_ORIGIN = https://your-netlify-site.netlify.app
FRONTEND_URL = https://your-netlify-site.netlify.app
EMAIL_USER = your-email@gmail.com
EMAIL_PASS = (Gmail app password - 16 characters)
NODE_ENV = production
```

#### Frontend (Netlify - in netlify.toml)
```
VITE_API_URL = https://your-backend.onrender.com/api
VITE_APP_NAME = EasyBid Platform
VITE_ENABLE_QR_SCANNER = true
VITE_ENABLE_NOTIFICATIONS = true
```

### Security Checks
- [ ] Strong JWT_SECRET generated (use crypto.randomBytes)
- [ ] MongoDB user has strong password
- [ ] Gmail 2FA enabled and app password generated
- [ ] `.env` files NOT committed to Git
- [ ] No hardcoded secrets in code

## 🗄️ Database Setup

### MongoDB Atlas
- [ ] Account created
- [ ] Free cluster created (M0)
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0 for testing)
- [ ] Connection string copied and tested
- [ ] Database name set to `easybid`

## 📧 Email Setup

### Gmail Configuration
- [ ] 2-Factor Authentication enabled
- [ ] App password generated for "Mail" application
- [ ] App password saved securely (16 characters)
- [ ] Test email sent successfully from local environment

## 📤 Git & Repository

### Repository Setup
- [ ] Code pushed to GitHub
- [ ] `.gitignore` working correctly
- [ ] No sensitive data in repository
- [ ] Branch is `main` or `master`
- [ ] Repository is accessible to deployment services

```bash
# Initialize and push if not done
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## 🖥️ Render Setup

### Account & Service
- [ ] Render account created (https://render.com)
- [ ] GitHub connected to Render
- [ ] Web Service type selected
- [ ] Repository connected
- [ ] Build and start commands verified:
  - Build: `npm install`
  - Start: `npm start`
- [ ] Root directory set to `backend`
- [ ] Environment variables added
- [ ] Free tier selected (or paid tier if needed)

### Post-Deployment
- [ ] Backend deployed successfully
- [ ] Backend URL noted: `https://easybid-backend.onrender.com`
- [ ] Health check passes (visit backend URL, should see JSON response)
- [ ] Logs reviewed for any errors

## 🌐 Netlify Setup

### Account & Site
- [ ] Netlify account created (https://netlify.com)
- [ ] GitHub connected to Netlify
- [ ] Repository connected
- [ ] Build settings configured:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
- [ ] Backend URL updated in `netlify.toml`
- [ ] Changes committed and pushed

### Post-Deployment
- [ ] Frontend deployed successfully
- [ ] Frontend URL noted: `https://your-site.netlify.app`
- [ ] Site loads without errors
- [ ] Can access all pages
- [ ] Backend CORS updated with frontend URL

## 🔄 Cross-Service Configuration

### Backend CORS Update
- [ ] `CLIENT_ORIGIN` in Render set to Netlify URL
- [ ] `FRONTEND_URL` in Render set to Netlify URL
- [ ] Backend redeployed after CORS update

### Frontend API Update
- [ ] `VITE_API_URL` points to Render backend
- [ ] Frontend redeployed after API URL update

## 🧪 Testing

### Functional Tests
- [ ] Can load frontend homepage
- [ ] Can register new user
- [ ] Can login with user credentials
- [ ] Can access user dashboard
- [ ] Backend API responds to requests
- [ ] CORS allows frontend-backend communication
- [ ] Email notifications work
- [ ] File uploads work
- [ ] PDF generation works
- [ ] QR code generation works

### Role-Based Tests
- [ ] Admin user created
- [ ] Admin can approve tenders
- [ ] Buyer can create tenders
- [ ] Supplier can submit bids
- [ ] Evaluator can evaluate bids

### Browser Tests
- [ ] Chrome/Edge works
- [ ] Firefox works
- [ ] Safari works (if available)
- [ ] Mobile responsive

## 📊 Monitoring Setup

### Render Monitoring
- [ ] Email notifications enabled for failures
- [ ] Logs accessible and reviewed
- [ ] Metrics dashboard checked

### Netlify Monitoring
- [ ] Deploy notifications configured
- [ ] Build logs reviewed
- [ ] Analytics enabled (optional)

### MongoDB Monitoring
- [ ] Atlas metrics reviewed
- [ ] Alert thresholds set (optional)
- [ ] Backup configured (optional)

## 🚨 Troubleshooting Preparation

### Common Issues Documented
- [ ] CORS errors → Check CLIENT_ORIGIN matches exactly
- [ ] MongoDB connection → Check connection string and IP whitelist
- [ ] Email not sending → Verify Gmail app password
- [ ] Frontend can't connect → Check VITE_API_URL ends with /api
- [ ] Render sleeps → Free tier limitation, expect 30s wake-up

### Debugging Resources
- [ ] Render logs location known
- [ ] Netlify deploy logs accessible
- [ ] MongoDB Atlas logs available
- [ ] Browser dev tools console checked

## 📝 Documentation

- [x] `RENDER_NETLIFY_DEPLOY.md` created with full instructions
- [x] `render.yaml` created for backend configuration
- [x] `netlify.toml` configured for frontend
- [x] `.env.example` files updated
- [x] README.md has deployment section

## 🎯 Final Checks

- [ ] All TODO items above completed
- [ ] Backend URL accessible: `https://easybid-backend.onrender.com`
- [ ] Frontend URL accessible: `https://your-site.netlify.app`
- [ ] Can complete full user flow end-to-end
- [ ] No console errors in browser
- [ ] No errors in backend logs
- [ ] Email notifications received
- [ ] MongoDB connection stable

## 🚀 Ready to Deploy!

Once all items are checked:
1. Follow `RENDER_NETLIFY_DEPLOY.md` guide
2. Deploy backend to Render first
3. Update frontend with backend URL
4. Deploy frontend to Netlify
5. Update backend CORS with frontend URL
6. Test thoroughly
7. Share with users!

---

**Current Status**: ✅ All pre-deployment preparations complete!

**Next Step**: Follow the step-by-step guide in `RENDER_NETLIFY_DEPLOY.md`
