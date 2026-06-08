# Event Vendor Marketplace - AWS Deployment

A full-stack event vendor marketplace built with **React + FastAPI + MongoDB**, ready to deploy on **AWS**.

## Features
- Vendor registration with shop details and image uploads (stored in **AWS S3**)
- Customer registration
- Location-based vendor search
- JWT authentication
- Responsive UI

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Lucide Icons
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (Atlas or AWS DocumentDB)
- **Storage**: AWS S3
- **Deployment**: AWS (EC2/ECS/Elastic Beanstalk + S3/CloudFront)

---

## Folder Structure
```
aws-deployment/
├── backend/                  # FastAPI backend
│   ├── server.py            # Main application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Backend container
│   └── .env.example         # Backend env template
├── frontend/                 # React frontend
│   ├── src/                 # Source code
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   ├── Dockerfile           # Frontend container
│   ├── nginx.conf           # Nginx config
│   └── .env.example         # Frontend env template
├── docker-compose.yml       # Local development
├── .gitignore
└── README.md                # This file
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- AWS Account with S3 bucket
- (Optional) MongoDB Atlas account

### 1. Clone & Configure
```bash
git clone <your-repo>
cd aws-deployment

# Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env with your AWS credentials and JWT secret
# Edit frontend/.env with REACT_APP_BACKEND_URL=http://localhost:8001
```

### 2. Run with Docker Compose
```bash
# Set environment variables in a root .env file
cat > .env <<EOF
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
JWT_SECRET=your-jwt-secret
EOF

# Start all services
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8001
# API Docs: http://localhost:8001/docs
```

### 3. Run Manually (without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Edit with your values
uvicorn server:app --reload --port 8001
```

**Frontend:**
```bash
cd frontend
yarn install
cp .env.example .env  # Edit REACT_APP_BACKEND_URL
yarn start
```

---

## ☁️ AWS Deployment Guide

### Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     INTERNET                            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────┐
            │   Route 53 (DNS)        │
            └────────────┬────────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
      ┌─────────────┐       ┌─────────────┐
      │  CloudFront │       │ App Load    │
      │    (CDN)    │       │ Balancer    │
      └──────┬──────┘       └──────┬──────┘
             │                     │
             ▼                     ▼
      ┌─────────────┐       ┌─────────────┐
      │  S3 Bucket  │       │  EC2/ECS    │
      │  (React)    │       │  (FastAPI)  │
      └─────────────┘       └──────┬──────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼                              ▼
            ┌─────────────┐             ┌─────────────────┐
            │  S3 Bucket  │             │ MongoDB Atlas / │
            │  (Images)   │             │  DocumentDB     │
            └─────────────┘             └─────────────────┘
```

---

### Step 1: Set Up MongoDB

**Option A: MongoDB Atlas (Easiest - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up and create a free M0 cluster
3. Create database user with username/password
4. Add IP `0.0.0.0/0` to network access (or restrict to your AWS VPC)
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/`

**Option B: AWS DocumentDB**
1. Open AWS Console → DocumentDB
2. Click "Create cluster"
3. Choose instance type (db.t3.medium for dev)
4. Set master username/password
5. Configure VPC and security groups (allow port 27017 from your backend)
6. Get endpoint URL

---

### Step 2: Create S3 Bucket for Vendor Images

```bash
# Using AWS CLI
aws s3 mb s3://your-event-marketplace-bucket --region us-east-1

# Set bucket policy (allow your backend role to read/write)
aws s3api put-bucket-cors --bucket your-event-marketplace-bucket --cors-configuration '{
  "CORSRules": [{
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"]
  }]
}'
```

Or via Console:
1. AWS Console → S3 → "Create bucket"
2. Name: `your-event-marketplace-bucket`
3. Region: `us-east-1`
4. Block public access: ON (we serve via backend)
5. Create bucket

---

### Step 3: Create IAM User/Role

**For local/EC2 deployment:**
1. AWS Console → IAM → Users → "Add user"
2. Name: `event-marketplace-app`
3. Attach policy (or create custom):
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject"
    ],
    "Resource": "arn:aws:s3:::your-event-marketplace-bucket/*"
  }]
}
```
4. Save Access Key ID and Secret Access Key

---

### Step 4: Deploy Backend

#### Option A: AWS Elastic Beanstalk (Easiest)
```bash
# Install EB CLI
pip install awsebcli

cd backend
eb init -p docker event-marketplace-api --region us-east-1
eb create event-marketplace-prod

# Set environment variables
eb setenv \
  MONGO_URL="mongodb+srv://..." \
  DB_NAME="event_marketplace" \
  S3_BUCKET_NAME="your-bucket" \
  AWS_REGION="us-east-1" \
  JWT_SECRET="your-secret" \
  CORS_ORIGINS="https://yourdomain.com"

eb deploy
```

#### Option B: AWS EC2 (Manual)
```bash
# Launch Ubuntu 22.04 EC2 instance (t3.small minimum)
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu

# Clone your repo
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend

# Build and run
docker build -t event-marketplace-backend .
docker run -d -p 8001:8001 \
  -e MONGO_URL="..." \
  -e DB_NAME="event_marketplace" \
  -e S3_BUCKET_NAME="..." \
  -e AWS_REGION="us-east-1" \
  -e JWT_SECRET="..." \
  -e CORS_ORIGINS="https://yourdomain.com" \
  --name backend \
  event-marketplace-backend
```

#### Option C: AWS ECS Fargate (Recommended for Production)
1. Push Docker image to ECR
```bash
aws ecr create-repository --repository-name event-marketplace-backend
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag event-marketplace-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/event-marketplace-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/event-marketplace-backend:latest
```
2. Create ECS cluster (Fargate)
3. Create task definition with the ECR image
4. Set environment variables in task definition
5. Create service with Application Load Balancer

---

### Step 5: Deploy Frontend

#### Option A: AWS Amplify (Easiest)
1. AWS Console → AWS Amplify → "New app" → "Host web app"
2. Connect your GitHub repository
3. Select branch (e.g., `main`)
4. Build settings (auto-detected for React):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - yarn install
    build:
      commands:
        - yarn build
  artifacts:
    baseDirectory: frontend/build
    files:
      - '**/*'
```
5. Set environment variable: `REACT_APP_BACKEND_URL=https://your-backend-url.com`
6. Deploy

#### Option B: S3 + CloudFront (Manual)
```bash
# Build the React app
cd frontend
yarn install
REACT_APP_BACKEND_URL=https://your-api.com yarn build

# Create S3 bucket for hosting
aws s3 mb s3://your-frontend-bucket
aws s3 website s3://your-frontend-bucket --index-document index.html --error-document index.html

# Upload build files
aws s3 sync build/ s3://your-frontend-bucket --acl public-read

# Create CloudFront distribution
# AWS Console → CloudFront → Create distribution
# Origin domain: your-frontend-bucket.s3.amazonaws.com
# Default root object: index.html
# Custom error responses: 403 → /index.html (for React Router)
```

---

### Step 6: Set Up Domain & SSL (Optional)

1. **Route 53**: Register domain or transfer
2. **ACM Certificate**:
   ```bash
   # Request SSL certificate (must be in us-east-1 for CloudFront)
   aws acm request-certificate --domain-name yourdomain.com --validation-method DNS
   ```
3. **Attach to CloudFront/ALB**: Update distribution/load balancer to use the certificate

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register-customer` | Register customer |
| POST | `/api/auth/register-vendor` | Register vendor (multipart) |
| POST | `/api/auth/login` | Login |
| GET | `/api/user/profile` | Get current user (auth) |
| GET | `/api/vendors` | Search vendors |
| GET | `/api/vendors/:id` | Get vendor by ID |
| GET | `/api/files/:path` | Serve uploaded image |
| GET | `/api/health` | Health check |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```bash
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=event_marketplace
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-key       # Leave empty if using IAM role
AWS_SECRET_ACCESS_KEY=your-secret # Leave empty if using IAM role
JWT_SECRET=your-secure-random-string
CORS_ORIGINS=https://yourdomain.com
```

### Frontend (`frontend/.env`)
```bash
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

---

## 💰 Estimated AWS Costs (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| EC2 (t3.small) | 1 instance | ~$15 |
| MongoDB Atlas | M0 Free | $0 |
| S3 Storage | 10 GB | ~$0.25 |
| S3 Requests | 100k requests | ~$0.50 |
| Data Transfer | 10 GB out | ~$0.90 |
| Route 53 | Hosted zone | $0.50 |
| Amplify Hosting | < 5 GB | ~$1 |
| **Total** | | **~$18/month** |

For higher traffic, expect $50-200/month with proper scaling.

---

## 🧪 Testing the Deployment

```bash
# Test backend health
curl https://your-api.com/api/health

# Test root
curl https://your-api.com/api/

# Register a customer
curl -X POST https://your-api.com/api/auth/register-customer \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","mobile":"+1234567890","name":"Test User"}'

# Search vendors
curl "https://your-api.com/api/vendors?city=NewYork"
```

---

## 🛠️ Troubleshooting

**Backend can't connect to MongoDB:**
- Check `MONGO_URL` is correct
- Verify IP whitelist in MongoDB Atlas allows your EC2 IP (or 0.0.0.0/0)
- For DocumentDB: Ensure security group allows port 27017 from backend

**Images not uploading:**
- Verify S3 bucket name is correct
- Check IAM permissions (s3:PutObject)
- Verify AWS credentials are set

**CORS errors:**
- Add your frontend domain to `CORS_ORIGINS` in backend env
- Restart backend service

**Frontend can't reach backend:**
- Verify `REACT_APP_BACKEND_URL` is correct
- Ensure backend security group allows HTTP/HTTPS
- Check ALB target group health

---

## 📝 License
MIT License - feel free to use for your projects.

## 🤝 Contributing
Pull requests welcome! Open an issue first to discuss changes.
