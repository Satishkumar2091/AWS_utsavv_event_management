"""Event Vendor Marketplace - Backend API Tests"""
import os
import uuid
import io
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://event-marketplace-42.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

UNIQ = uuid.uuid4().hex[:8]
VENDOR_EMAIL = f"TEST_vendor_{UNIQ}@test.com"
CUSTOMER_EMAIL = f"TEST_customer_{UNIQ}@test.com"
PASSWORD = "TestPass123!"

state = {}


# ---------- Health ----------
def test_root():
    r = requests.get(f"{API}/", timeout=30)
    assert r.status_code == 200
    assert "message" in r.json()


# ---------- Vendor registration (multipart) ----------
def test_register_vendor_with_image():
    fake_img = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"0" * 100)
    files = [("images", ("shop.png", fake_img, "image/png"))]
    data = {
        "email": VENDOR_EMAIL,
        "password": PASSWORD,
        "mobile": "+11234567890",
        "shop_name": "TEST Shop",
        "shop_location": "123 Test St",
        "city": "Boston",
        "latitude": "42.3601",
        "longitude": "-71.0589",
        "equipment_details": "Pro gear",
    }
    r = requests.post(f"{API}/auth/register-vendor", data=data, files=files, timeout=60)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["user_type"] == "vendor"
    assert "token" in body and len(body["token"]) > 0
    state["vendor_token"] = body["token"]


def test_register_vendor_duplicate():
    data = {
        "email": VENDOR_EMAIL,
        "password": PASSWORD,
        "mobile": "+11234567890",
        "shop_name": "TEST Shop2",
        "shop_location": "x",
        "city": "Boston",
        "equipment_details": "Pro gear",
    }
    r = requests.post(f"{API}/auth/register-vendor", data=data, timeout=30)
    assert r.status_code == 400


# ---------- Customer registration ----------
def test_register_customer():
    payload = {
        "email": CUSTOMER_EMAIL,
        "password": PASSWORD,
        "mobile": "+19876543210",
        "name": "TEST Customer",
    }
    r = requests.post(f"{API}/auth/register-customer", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["user_type"] == "customer"
    assert "token" in body
    state["customer_token"] = body["token"]


def test_register_customer_duplicate():
    payload = {
        "email": CUSTOMER_EMAIL,
        "password": PASSWORD,
        "mobile": "+19876543210",
        "name": "TEST Customer",
    }
    r = requests.post(f"{API}/auth/register-customer", json=payload, timeout=30)
    assert r.status_code == 400


# ---------- Login ----------
def test_login_vendor():
    r = requests.post(f"{API}/auth/login", json={"email": VENDOR_EMAIL, "password": PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    assert r.json()["user_type"] == "vendor"


def test_login_customer():
    r = requests.post(f"{API}/auth/login", json={"email": CUSTOMER_EMAIL, "password": PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    assert r.json()["user_type"] == "customer"


def test_login_invalid_password():
    r = requests.post(f"{API}/auth/login", json={"email": VENDOR_EMAIL, "password": "wrong"}, timeout=30)
    assert r.status_code == 401


def test_login_unknown_email():
    r = requests.post(f"{API}/auth/login", json={"email": f"nobody_{UNIQ}@x.com", "password": "x"}, timeout=30)
    assert r.status_code == 401


# ---------- Profile (auth) ----------
def test_profile_vendor():
    token = state.get("vendor_token")
    if not token:
        pytest.skip("no token")
    r = requests.get(f"{API}/user/profile", headers={"Authorization": f"Bearer {token}"}, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == VENDOR_EMAIL
    assert body["user_type"] == "vendor"
    assert body["shop_name"] == "TEST Shop"
    state["vendor_id"] = body["id"]
    state["shop_images"] = body.get("shop_images", [])


def test_profile_customer():
    token = state.get("customer_token")
    if not token:
        pytest.skip("no token")
    r = requests.get(f"{API}/user/profile", headers={"Authorization": f"Bearer {token}"}, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == CUSTOMER_EMAIL
    assert body["name"] == "TEST Customer"


def test_profile_no_auth():
    r = requests.get(f"{API}/user/profile", timeout=30)
    assert r.status_code in (401, 422)


def test_profile_bad_token():
    r = requests.get(f"{API}/user/profile", headers={"Authorization": "Bearer junk"}, timeout=30)
    assert r.status_code == 401


# ---------- Vendor search ----------
def test_search_vendors_by_city():
    r = requests.get(f"{API}/vendors", params={"city": "Boston"}, timeout=30)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    assert any(v["email"] == VENDOR_EMAIL for v in items)


def test_search_vendors_no_filter():
    r = requests.get(f"{API}/vendors", timeout=30)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_search_vendors_by_coordinates():
    r = requests.get(f"{API}/vendors", params={"latitude": 42.36, "longitude": -71.06, "max_distance": 50}, timeout=30)
    assert r.status_code == 200
    assert any(v["email"] == VENDOR_EMAIL for v in r.json())


def test_get_vendor_by_id():
    vid = state.get("vendor_id")
    if not vid:
        pytest.skip("no vendor id")
    r = requests.get(f"{API}/vendors/{vid}", timeout=30)
    assert r.status_code == 200
    assert r.json()["email"] == VENDOR_EMAIL


def test_get_vendor_not_found():
    r = requests.get(f"{API}/vendors/{uuid.uuid4()}", timeout=30)
    assert r.status_code == 404


# ---------- File retrieval ----------
def test_get_uploaded_image():
    paths = state.get("shop_images") or []
    if not paths:
        pytest.skip("no uploaded image")
    r = requests.get(f"{API}/files/{paths[0]}", timeout=60)
    assert r.status_code == 200
    assert len(r.content) > 0
