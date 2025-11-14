# 🚀 EasyBid Platform - Enterprise Procurement System

A complete enterprise-grade procurement platform with admin approval workflows, advanced visualizations, email notifications, PDF generation, and QR code integration.

## ✨ Features

- 🎯 **Admin Approval Workflow** - Complete buyer-to-admin tender approval system
- 📋 **Enhanced Tender Categories** - Dropdown with custom category options  
- 📧 **Email Notification System** - Professional HTML templates with user preferences
- 📄 **PDF Generation & Downloads** - Comprehensive documents with embedded QR codes
- 📊 **Advanced Visualizations** - Rich dashboard analytics and charts
- 🔍 **QR Code Integration** - Complete scanning and generation system
- 🔐 **Role-Based Access Control** - Admin, Buyer, Supplier roles
- 📱 **Mobile Responsive** - Optimized for all devices
- 🎨 **Modern UI/UX** - Glassmorphism design with smooth animations

## 🏗️ Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS + Framer Motion + Recharts
- **Backend**: Node.js + Express + MongoDB + JWT Authentication
- **Services**: Email (NodeMailer), PDF (PDFKit), QR Codes (QRCode)
- **Database**: MongoDB with optimized schemas

## 🚀 Quick Deployment

### Option 1: Railway (Recommended) ⭐
```bash
# Windows
deploy.bat railway

# Linux/Mac
./deploy.sh railway
```

### Option 2: Docker (Local/Cloud)
```bash
# Windows/Linux/Mac
docker-compose up --build -d
```

### Option 3: Vercel + MongoDB Atlas
```bash
# Windows
deploy.bat vercel

# Linux/Mac
./deploy.sh vercel
```

## 📋 Prerequisites

- Node.js 20.19+ (or 22.12+)
- MongoDB (local or cloud)
- Git
- Email account for notifications (Gmail recommended)

## 🛠️ Local Development Setup

### 1. Clone and Install
```bash
git clone <your-repo>
cd easybid
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configurations
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🌐 Production Deployment Guide

### Railway Deployment (Free Tier Available)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   railway login
   railway init --name easybid-backend
   railway add mongodb
   railway deploy
   ```

3. **Configure Environment Variables** in Railway Dashboard:
   - `JWT_SECRET`: Strong secret key
   - `FRONTEND_URL`: Your frontend URL
   - `EMAIL_USER`: Your email
   - `EMAIL_PASS`: App-specific password
   - `MONGO_URI`: Auto-configured by Railway

4. **Deploy Frontend**:
   ```bash
   cd frontend
   railway init --name easybid-frontend
   railway deploy
   ```

5. **Update Frontend Environment**:
   - Set `VITE_API_URL` to your backend Railway URL

### Alternative: MongoDB Atlas + Vercel

1. **Setup MongoDB Atlas**:
   - Create account at https://cloud.mongodb.com
   - Create cluster and get connection string

2. **Deploy Backend to Vercel**:
   ```bash
   cd backend
   npm i -g vercel
   vercel
   ```

3. **Deploy Frontend to Vercel**:
   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment Variables** in Vercel Dashboard

### Docker Production Setup

1. **Update docker-compose.yml**:
   - Change default passwords
   - Configure environment variables
   - Set up SSL certificates

2. **Deploy**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/easybid
JWT_SECRET=your-super-secret-key
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=EasyBid Platform
```

### Email Setup (Gmail)
1. Enable 2-Factor Authentication
2. Generate App-Specific Password
3. Use this password in `EMAIL_PASS`

## 📱 Mobile App Deployment

The platform is fully responsive and works as a PWA. To deploy as mobile app:

1. **PWA Setup**: Already configured in frontend
2. **Capacitor (Optional)**:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   npx cap add ios
   npx cap add android
   ```

## 🔒 Security Considerations

- JWT tokens with secure secrets
- Input validation and sanitization
- Rate limiting on APIs
- CORS configuration
- File upload restrictions
- MongoDB injection prevention

## 📊 Monitoring & Analytics

### Health Checks
- Backend: `/health`
- Database connectivity checks
- Service availability monitoring

### Logging
- Request/response logging
- Error tracking
- Performance monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID [PID] /F
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill -9
   ```

2. **MongoDB Connection Issues**:
   - Check connection string
   - Verify network access
   - Ensure database exists

3. **Email Not Sending**:
   - Verify app-specific password
   - Check firewall settings
   - Test SMTP connection

### Support

For deployment issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints
4. Check CORS configuration

## 📈 Scaling

### Performance Optimization
- Database indexing
- Image optimization
- CDN integration
- Caching strategies

### Horizontal Scaling
- Load balancer setup
- Multiple backend instances
- Database clustering
- File storage solutions

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database secured and backed up
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Email service tested
- [ ] File uploads working
- [ ] QR code generation tested
- [ ] PDF downloads working
- [ ] Mobile responsiveness verified
- [ ] Performance testing completed

## 📞 Support

For technical support or deployment assistance, please refer to the deployment logs and configuration guides above.

---

**🎉 Your EasyBid Platform is ready for production deployment!**