#!/bin/bash

# EasyBid Platform Deployment Script
echo "🚀 EasyBid Platform Deployment"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if deployment method is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 [railway|vercel|docker|heroku]"
    exit 1
fi

DEPLOYMENT_METHOD=$1

case $DEPLOYMENT_METHOD in
    "railway")
        print_status "Deploying to Railway..."
        
        # Check if Railway CLI is installed
        if ! command -v railway &> /dev/null; then
            print_error "Railway CLI not found. Installing..."
            npm install -g @railway/cli
        fi
        
        # Deploy backend
        print_status "Deploying backend..."
        cd backend
        railway login
        railway init --name easybid-backend
        railway add mongodb
        railway deploy
        
        # Deploy frontend
        print_status "Deploying frontend..."
        cd ../frontend
        railway init --name easybid-frontend
        railway deploy
        
        print_success "Deployment to Railway completed!"
        ;;
        
    "vercel")
        print_status "Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            print_error "Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        
        # Deploy backend
        print_status "Deploying backend..."
        cd backend
        vercel --prod
        
        # Deploy frontend
        print_status "Deploying frontend..."
        cd ../frontend
        vercel --prod
        
        print_success "Deployment to Vercel completed!"
        ;;
        
    "docker")
        print_status "Deploying with Docker..."
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            print_error "Docker not found. Please install Docker first."
            exit 1
        fi
        
        # Build and run with Docker Compose
        print_status "Building and starting containers..."
        docker-compose down
        docker-compose up --build -d
        
        print_success "Docker deployment completed!"
        print_status "Application available at:"
        print_status "Frontend: http://localhost:3000"
        print_status "Backend: http://localhost:5000"
        ;;
        
    "heroku")
        print_status "Deploying to Heroku..."
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            print_error "Heroku CLI not found. Please install Heroku CLI first."
            exit 1
        fi
        
        # Deploy backend
        print_status "Deploying backend..."
        cd backend
        heroku create easybid-backend-$(date +%s)
        heroku addons:create mongolab:sandbox
        git init
        git add .
        git commit -m "Initial backend deployment"
        git push heroku main
        
        # Deploy frontend
        print_status "Deploying frontend..."
        cd ../frontend
        heroku create easybid-frontend-$(date +%s)
        heroku buildpacks:set mars/create-react-app
        git init
        git add .
        git commit -m "Initial frontend deployment"
        git push heroku main
        
        print_success "Deployment to Heroku completed!"
        ;;
        
    *)
        print_error "Unknown deployment method: $DEPLOYMENT_METHOD"
        echo "Available methods: railway, vercel, docker, heroku"
        exit 1
        ;;
esac

print_success "🎉 EasyBid Platform deployment completed!"
print_status "Don't forget to:"
print_status "1. Configure environment variables"
print_status "2. Set up your database"
print_status "3. Update CORS settings"
print_status "4. Test all features"