# Event Vendor Marketplace - Setup & Deployment Guide

## Project Overview
A full-stack event vendor marketplace where vendors can register with shop details and images, and customers can search for vendors by location.

## Technology Stack
- **Frontend**: React 19, Tailwind CSS, Lucide Icons
- **Backend**: FastAPI (Python), Motor (MongoDB async driver)
- **Database**: MongoDB
- **Storage**: Emergent Object Storage (for vendor images)
- **Authentication**: JWT tokens with bcrypt password hashing

---

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER FLOW                                │
└─────────────────────────────────────────────────────────────────┘

1. LANDING PAGE (/)
   │
   ├─> Browse Featured Vendors
   ├─> Search by City
   └─> View Vendor Details

2. REGISTRATION
   │
   ├─> CUSTOMER SIGNUP (/signup)
   │   ├─> Enter: Name, Email, Mobile, Password
   │   └─> Auto-login after registration
   │
   └─> VENDOR SIGNUP (/signup)
       ├─> Enter: Shop Name, Email, Mobile, Location, City, Equipment
       ├─> Upload: Shop Pictures (optional)
       └─> Auto-login after registration

3. AUTHENTICATION (/signin)
   │
   ├─> Enter: Email, Password
   └─> Redirect to Dashboard

4. DASHBOARD (/dashboard)
   │
   ├─> CUSTOMER DASHBOARD
   │   ├─> View profile info
   │   └─> Stats: Saved Vendors, Bookings
   │
   └─> VENDOR DASHBOARD
       ├─> View profile info
       ├─> Stats: Profile Views, Inquiries
       └─> View uploaded shop gallery

5. EVENTS PAGE (/events)
   └─> Browse event categories (Photography, Catering, Decoration, etc.)

6. VENDOR PROFILE (/vendor/:id)
   ├─> View vendor details
   ├─> Browse shop images (gallery with navigation)
   └─> Contact vendor (email, phone)
```

---

## API Endpoints

### Authentication
```
POST /api/auth/register-customer
Body: { email, password, mobile, name }
Response: { token, user_type, message }

POST /api/auth/register-vendor (multipart/form-data)
Fields: email, password, mobile, shop_name, shop_location, city, equipment_details, images[]
Response: { token, user_type, message }

POST /api/auth/login
Body: { email, password }
Response: { token, user_type, message }
```

### User Profile
```
GET /api/user/profile
Headers: Authorization: Bearer <token>
Response: { id, email, mobile, user_type, name/shop_name, ... }
```

### Vendors
```
GET /api/vendors?city=<city>&latitude=<lat>&longitude=<lon>&max_distance=<km>
Response: [ { id, email, mobile, shop_name, city, equipment_details, shop_images[] } ]

GET /api/vendors/:vendor_id
Response: { id, email, mobile, shop_name, city, shop_location, equipment_details, shop_images[] }
```

### File Storage
```
GET /api/files/:path
Response: Image file (served directly)
```

---

## Database Schema (MongoDB)

### Customers Collection
```javascript
{
  id: "uuid",
  email: "customer@example.com",
  password_hash: "bcrypt_hash",
  mobile: "+1234567890",
  name: "John Doe",
  user_type: "customer",
  created_at: "2026-01-01T00:00:00.000Z"
}
```

### Vendors Collection
```javascript
{
  id: "uuid",
  email: "vendor@example.com",
  password_hash: "bcrypt_hash",
  mobile: "+1234567890",
  shop_name: "ABC Photography",
  shop_location: "123 Main St",
  city: "New York",
  latitude: 40.7128,  // optional
  longitude: -74.0060,  // optional
  equipment_details: "Professional cameras, lighting, drones...",
  shop_images: [
    "event-marketplace/vendors/vendor@example.com/uuid1.jpg",
    "event-marketplace/vendors/vendor@example.com/uuid2.jpg"
  ],
  user_type: "vendor",
  created_at: "2026-01-01T00:00:00.000Z"
}
```

---

## How to Download and Use This Code

### Step 1: Download Project Files
1. Click on the **Download Code** button in the Emergent dashboard
2. Extract the ZIP file to your local machine

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit backend/.env file:
MONGO_URL="mongodb://localhost:27017"
DB_NAME="event_marketplace"
EMERGENT_LLM_KEY="your-emergent-key"  # Get from Emergent dashboard
APP_NAME="event-marketplace"
CORS_ORIGINS="http://localhost:3000"

# Run the backend server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
yarn install

# Configure environment variables
# Edit frontend/.env file:
REACT_APP_BACKEND_URL="http://localhost:8001"

# Run the frontend
yarn start
```

### Step 4: MongoDB Setup
```bash
# Install MongoDB locally or use MongoDB Atlas (cloud)
# For local installation:
# - Download from https://www.mongodb.com/try/download/community
# - Start MongoDB service

# For MongoDB Atlas:
# 1. Sign up at https://www.mongodb.com/cloud/atlas
# 2. Create a cluster
# 3. Get connection string and update MONGO_URL in backend/.env
```

### Step 5: Access the Application
```
Frontend: http://localhost:3000
Backend API: http://localhost:8001
API Docs: http://localhost:8001/docs
```

---

## Deployment Options

### Option 1: Deploy via Emergent
- Your app is already deployed at: https://event-marketplace-42.preview.emergentagent.com
- All services are pre-configured and running

### Option 2: Deploy to Your Own Server

#### Backend Deployment (Render, Railway, Heroku)
1. Push code to GitHub repository
2. Connect repository to deployment platform
3. Set environment variables:
   - MONGO_URL
   - DB_NAME
   - EMERGENT_LLM_KEY
   - CORS_ORIGINS
4. Deploy

#### Frontend Deployment (Vercel, Netlify)
1. Push code to GitHub repository
2. Connect repository to deployment platform
3. Set build command: `yarn build`
4. Set environment variable: REACT_APP_BACKEND_URL
5. Deploy

---

## Key Features Implemented

### ✓ Vendor Registration
- Shop name, location, city, mobile, email
- Equipment/services description
- Multiple shop image uploads (stored in object storage)
- JWT authentication

### ✓ Customer Registration
- Name, email, mobile, password
- JWT authentication

### ✓ Vendor Search
- Search by city name (text-based)
- Distance calculation (if coordinates provided)
- Filter by maximum distance

### ✓ Beautiful UI/UX
- Warm & earthy design theme (Cabinet Grotesk + Satoshi fonts)
- Responsive navigation with glass morphism effect
- Card-based vendor listings with hover effects
- Image gallery with navigation for vendor profiles
- Smooth animations and transitions

### ✓ Dashboard
- Separate views for vendors and customers
- Profile information display
- Statistics cards
- Shop gallery for vendors

### ✓ Security
- Passwords hashed with bcrypt
- JWT token-based authentication
- Protected API routes
- CORS configured

---

## Folder Structure

```
project/
├── backend/
│   ├── server.py              # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Navigation.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Events.jsx
│   │   │   └── VendorProfile.jsx
│   │   ├── constants/
│   │   │   └── testIds.js    # Test identifiers
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # Custom styles
│   │   └── index.css         # Tailwind + global styles
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Tailwind configuration
│   └── .env                  # Environment variables
│
└── README.md                 # This file
```

---

## Testing the Application

### Manual Testing Flow

1. **Create a Vendor Account**
   - Navigate to /signup
   - Switch to "I'm a Vendor" tab
   - Fill in all fields and upload 2-3 shop images
   - Submit and verify auto-login to dashboard

2. **Create a Customer Account**
   - Logout and navigate to /signup
   - Stay on "I'm a Customer" tab
   - Fill in all fields and submit
   - Verify auto-login to dashboard

3. **Search for Vendors**
   - Logout and navigate to home page
   - Enter city name in search bar
   - Verify vendor appears in results

4. **View Vendor Profile**
   - Click on a vendor card
   - Verify all details are displayed
   - Navigate through image gallery
   - Check contact information

5. **Test Authentication**
   - Logout
   - Try to access /dashboard (should redirect to signin)
   - Login with vendor/customer credentials
   - Verify correct dashboard is shown

---

## Support & Troubleshooting

### Common Issues

**Backend not starting:**
- Check MongoDB is running
- Verify MONGO_URL in .env is correct
- Ensure all dependencies are installed

**Frontend shows connection error:**
- Verify backend is running on correct port
- Check REACT_APP_BACKEND_URL in frontend/.env
- Ensure CORS is properly configured

**Images not uploading:**
- Verify EMERGENT_LLM_KEY is set correctly
- Check backend logs for storage initialization errors
- Ensure file size is within limits

**Search not working:**
- Verify vendors exist in database
- Check city names match exactly (case-insensitive search)
- Review backend logs for query errors

---

## Next Steps / Enhancements

- Add vendor reviews and ratings system
- Implement booking/inquiry system for customers
- Add email notifications for new inquiries
- Integrate real-time chat between customers and vendors
- Add advanced filters (price range, availability, services)
- Implement vendor analytics dashboard
- Add payment integration for booking deposits
- Build mobile app version

---

## License
This project is provided as-is for educational and commercial use.

## Created With
Built with ❤️ using Emergent AI Platform