import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AUTH } from '@/constants/testIds';
import { Mail, Lock, Phone, User, Building, MapPin, FileText, Image } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SignUp() {
  const [userType, setUserType] = useState('customer'); // 'customer' or 'vendor'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Customer fields
  const [customerData, setCustomerData] = useState({
    email: '',
    password: '',
    mobile: '',
    name: ''
  });

  // Vendor fields
  const [vendorData, setVendorData] = useState({
    email: '',
    password: '',
    mobile: '',
    shop_name: '',
    shop_location: '',
    city: '',
    equipment_details: ''
  });
  const [images, setImages] = useState([]);

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/auth/register-customer`, customerData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.user_type);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
    setLoading(false);
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      Object.keys(vendorData).forEach(key => {
        formData.append(key, vendorData[key]);
      });
      
      // Add images
      images.forEach(img => {
        formData.append('images', img);
      });

      const response = await axios.post(`${API}/auth/register-vendor`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.user_type);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-textPrimary mb-4">
            Join Our Marketplace
          </h1>
          <p className="text-textSecondary text-lg">
            Create your account to get started
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="flex gap-4 mb-8 bg-white rounded-2xl p-2 shadow-sm">
          <button
            data-testid={AUTH.customerTab}
            onClick={() => setUserType('customer')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
              userType === 'customer'
                ? 'bg-terracotta text-white'
                : 'text-textSecondary hover:bg-warmSandSecondary'
            }`}
          >
            I'm a Customer
          </button>
          <button
            data-testid={AUTH.vendorTab}
            onClick={() => setUserType('vendor')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
              userType === 'vendor'
                ? 'bg-terracotta text-white'
                : 'text-textSecondary hover:bg-warmSandSecondary'
            }`}
          >
            I'm a Vendor
          </button>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-forestGreen/10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
              {error}
            </div>
          )}

          {userType === 'customer' ? (
            <form onSubmit={handleCustomerSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <User className="inline mr-2" size={16} />
                  Full Name
                </label>
                <input
                  data-testid={AUTH.nameInput}
                  type="text"
                  required
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <Mail className="inline mr-2" size={16} />
                  Email Address
                </label>
                <input
                  data-testid={AUTH.emailInput}
                  type="email"
                  required
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <Phone className="inline mr-2" size={16} />
                  Mobile Number
                </label>
                <input
                  data-testid={AUTH.mobileInput}
                  type="tel"
                  required
                  value={customerData.mobile}
                  onChange={(e) => setCustomerData({...customerData, mobile: e.target.value})}
                  className="input-field"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <Lock className="inline mr-2" size={16} />
                  Password
                </label>
                <input
                  data-testid={AUTH.passwordInput}
                  type="password"
                  required
                  value={customerData.password}
                  onChange={(e) => setCustomerData({...customerData, password: e.target.value})}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                data-testid={AUTH.submitBtn}
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg"
              >
                {loading ? 'Creating Account...' : 'Sign Up as Customer'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVendorSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <Building className="inline mr-2" size={16} />
                  Shop Name
                </label>
                <input
                  data-testid={AUTH.shopNameInput}
                  type="text"
                  required
                  value={vendorData.shop_name}
                  onChange={(e) => setVendorData({...vendorData, shop_name: e.target.value})}
                  className="input-field"
                  placeholder="ABC Photography"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <Mail className="inline mr-2" size={16} />
                  Email Address
                </label>
                <input
                  data-testid={AUTH.emailInput}
                  type="email"
                  required
                  value={vendorData.email}
                  onChange={(e) => setVendorData({...vendorData, email: e.target.value})}
                  className="input-field"
                  placeholder="vendor@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <Phone className="inline mr-2" size={16} />
                  Mobile Number
                </label>
                <input
                  data-testid={AUTH.mobileInput}
                  type="tel"
                  required
                  value={vendorData.mobile}
                  onChange={(e) => setVendorData({...vendorData, mobile: e.target.value})}
                  className="input-field"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <MapPin className="inline mr-2" size={16} />
                  Shop Location
                </label>
                <input
                  data-testid={AUTH.shopLocationInput}
                  type="text"
                  required
                  value={vendorData.shop_location}
                  onChange={(e) => setVendorData({...vendorData, shop_location: e.target.value})}
                  className="input-field"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <MapPin className="inline mr-2" size={16} />
                  City
                </label>
                <input
                  data-testid={AUTH.cityInput}
                  type="text"
                  required
                  value={vendorData.city}
                  onChange={(e) => setVendorData({...vendorData, city: e.target.value})}
                  className="input-field"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <FileText className="inline mr-2" size={16} />
                  Equipment Details
                </label>
                <textarea
                  data-testid={AUTH.equipmentInput}
                  required
                  value={vendorData.equipment_details}
                  onChange={(e) => setVendorData({...vendorData, equipment_details: e.target.value})}
                  className="input-field"
                  rows="3"
                  placeholder="Describe your services and equipment..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <Image className="inline mr-2" size={16} />
                  Shop Pictures (Optional)
                </label>
                <input
                  data-testid={AUTH.imagesInput}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="input-field"
                />
                {images.length > 0 && (
                  <p className="text-sm text-textMuted mt-2">{images.length} file(s) selected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  <Lock className="inline mr-2" size={16} />
                  Password
                </label>
                <input
                  data-testid={AUTH.passwordInput}
                  type="password"
                  required
                  value={vendorData.password}
                  onChange={(e) => setVendorData({...vendorData, password: e.target.value})}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                data-testid={AUTH.submitBtn}
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg"
              >
                {loading ? 'Creating Account...' : 'Sign Up as Vendor'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-textSecondary">
              Already have an account?{' '}
              <Link to="/signin" className="text-terracotta font-medium hover:text-terracottaHover">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}