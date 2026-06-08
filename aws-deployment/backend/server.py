"""
Event Vendor Marketplace - FastAPI Backend (AWS Compatible)
Uses AWS S3 for object storage and MongoDB (Atlas or DocumentDB) for database.
"""
from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Header, Query
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import math
import boto3
from botocore.exceptions import ClientError

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ============ CONFIGURATION ============
# MongoDB connection (works with MongoDB Atlas or AWS DocumentDB)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# AWS S3 Configuration
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')
S3_BUCKET = os.environ['S3_BUCKET_NAME']
AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')

# Initialize S3 client (uses IAM role if running on EC2, otherwise uses env vars)
if AWS_ACCESS_KEY and AWS_SECRET_KEY:
    s3_client = boto3.client(
        's3',
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY
    )
else:
    # Use IAM role attached to EC2/ECS
    s3_client = boto3.client('s3', region_name=AWS_REGION)

# JWT Configuration
SECRET_KEY = os.environ['JWT_SECRET']
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

app = FastAPI(title="Event Vendor Marketplace API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ S3 STORAGE FUNCTIONS ============
def put_object_s3(key: str, data: bytes, content_type: str) -> dict:
    """Upload file to AWS S3"""
    try:
        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=key,
            Body=data,
            ContentType=content_type
        )
        return {"path": key, "size": len(data)}
    except ClientError as e:
        logger.error(f"S3 upload failed: {e}")
        raise HTTPException(status_code=500, detail="File upload failed")

def get_object_s3(key: str) -> tuple:
    """Download file from AWS S3"""
    try:
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=key)
        return response['Body'].read(), response.get('ContentType', 'application/octet-stream')
    except ClientError as e:
        logger.error(f"S3 download failed: {e}")
        raise HTTPException(status_code=404, detail="File not found")

# ============ MODELS ============
class CustomerRegister(BaseModel):
    email: EmailStr
    password: str
    mobile: str
    name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VendorResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    mobile: str
    shop_name: str
    shop_location: str
    city: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    equipment_details: str
    shop_images: List[str] = []
    created_at: str

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    mobile: str
    user_type: str
    name: Optional[str] = None
    shop_name: Optional[str] = None
    shop_location: Optional[str] = None
    city: Optional[str] = None
    equipment_details: Optional[str] = None
    shop_images: List[str] = []
    created_at: str

# ============ HELPER FUNCTIONS ============
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type == "vendor":
        user = await db.vendors.find_one({"id": user_id}, {"_id": 0})
    else:
        user = await db.customers.find_one({"id": user_id}, {"_id": 0})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance using Haversine formula (in kilometers)"""
    if None in [lat1, lon1, lat2, lon2]:
        return float('inf')
    R = 6371
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

# ============ ROUTES ============
@api_router.post("/auth/register-vendor")
async def register_vendor(
    email: str = Form(...),
    password: str = Form(...),
    mobile: str = Form(...),
    shop_name: str = Form(...),
    shop_location: str = Form(...),
    city: str = Form(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    equipment_details: str = Form(...),
    images: List[UploadFile] = File(None)
):
    existing = await db.vendors.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    shop_images = []
    if images:
        for img in images:
            if img.filename:
                ext = img.filename.split(".")[-1] if "." in img.filename else "jpg"
                key = f"vendors/{email}/{uuid.uuid4()}.{ext}"
                data = await img.read()
                result = put_object_s3(key, data, img.content_type or "image/jpeg")
                shop_images.append(result["path"])
    
    vendor_id = str(uuid.uuid4())
    vendor = {
        "id": vendor_id,
        "email": email,
        "password_hash": hash_password(password),
        "mobile": mobile,
        "shop_name": shop_name,
        "shop_location": shop_location,
        "city": city,
        "latitude": latitude,
        "longitude": longitude,
        "equipment_details": equipment_details,
        "shop_images": shop_images,
        "user_type": "vendor",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.vendors.insert_one(vendor)
    
    token = create_access_token({"user_id": vendor_id, "user_type": "vendor"})
    return {"token": token, "user_type": "vendor", "message": "Vendor registered successfully"}

@api_router.post("/auth/register-customer")
async def register_customer(data: CustomerRegister):
    existing = await db.customers.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    customer_id = str(uuid.uuid4())
    customer = {
        "id": customer_id,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "mobile": data.mobile,
        "name": data.name,
        "user_type": "customer",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.customers.insert_one(customer)
    
    token = create_access_token({"user_id": customer_id, "user_type": "customer"})
    return {"token": token, "user_type": "customer", "message": "Customer registered successfully"}

@api_router.post("/auth/login")
async def login(data: LoginRequest):
    user = await db.vendors.find_one({"email": data.email}, {"_id": 0})
    user_type = "vendor"
    if not user:
        user = await db.customers.find_one({"email": data.email}, {"_id": 0})
        user_type = "customer"
    
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"user_id": user["id"], "user_type": user_type})
    return {"token": token, "user_type": user_type, "message": "Login successful"}

@api_router.get("/user/profile", response_model=UserProfile)
async def get_profile(authorization: str = Header(...)):
    return await get_current_user(authorization)

@api_router.get("/vendors", response_model=List[VendorResponse])
async def search_vendors(
    city: Optional[str] = Query(None),
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    max_distance: Optional[float] = Query(50)
):
    query = {}
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    
    vendors = await db.vendors.find(query, {"_id": 0, "password_hash": 0}).to_list(1000)
    
    if latitude is not None and longitude is not None:
        for vendor in vendors:
            vendor["distance"] = calculate_distance(
                latitude, longitude,
                vendor.get("latitude"), vendor.get("longitude")
            )
        vendors = [v for v in vendors if v.get("distance", float('inf')) <= max_distance]
        vendors.sort(key=lambda x: x.get("distance", float('inf')))
    
    return vendors

@api_router.get("/vendors/{vendor_id}", response_model=VendorResponse)
async def get_vendor(vendor_id: str):
    vendor = await db.vendors.find_one({"id": vendor_id}, {"_id": 0, "password_hash": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@api_router.get("/files/{path:path}")
async def get_file(path: str):
    """Serve files from S3"""
    data, content_type = get_object_s3(path)
    return Response(content=data, media_type=content_type)

@api_router.get("/")
async def root():
    return {"message": "Event Vendor Marketplace API", "status": "running"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8001)))
