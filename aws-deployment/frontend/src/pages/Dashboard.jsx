import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DASHBOARD } from '../constants/testIds';
import { User, Phone, Mail, Building, MapPin, FileText, LogOut } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const response = await axios.get(`${API}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        navigate('/signin');
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-textSecondary">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isVendor = profile.user_type === 'vendor';

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-textPrimary mb-2">
              {isVendor ? 'Vendor Dashboard' : 'My Dashboard'}
            </h1>
            <p className="text-textSecondary">
              Welcome back, {isVendor ? profile.shop_name : profile.name}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div data-testid={DASHBOARD.statsCard} className="bg-white rounded-2xl p-6 border border-forestGreen/10">
            <div className="text-terracotta text-3xl font-bold mb-2">
              {isVendor ? '0' : '0'}
            </div>
            <p className="text-textSecondary">
              {isVendor ? 'Profile Views' : 'Saved Vendors'}
            </p>
          </div>

          <div data-testid={DASHBOARD.statsCard} className="bg-white rounded-2xl p-6 border border-forestGreen/10">
            <div className="text-terracotta text-3xl font-bold mb-2">
              {isVendor ? '0' : '0'}
            </div>
            <p className="text-textSecondary">
              {isVendor ? 'Inquiries' : 'Bookings'}
            </p>
          </div>

          <div data-testid={DASHBOARD.statsCard} className="bg-white rounded-2xl p-6 border border-forestGreen/10">
            <div className="text-terracotta text-3xl font-bold mb-2">
              {isVendor ? profile.shop_images?.length || 0 : '0'}
            </div>
            <p className="text-textSecondary">
              {isVendor ? 'Shop Images' : 'Reviews Given'}
            </p>
          </div>
        </div>

        <div data-testid={DASHBOARD.profileCard} className="bg-white rounded-2xl p-8 border border-forestGreen/10">
          <h2 className="font-heading text-2xl font-bold text-textPrimary mb-6">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isVendor && (
              <div className="flex items-start gap-3">
                <User className="text-terracotta mt-1" size={20} />
                <div>
                  <p className="text-textMuted text-sm mb-1">Full Name</p>
                  <p className="text-textPrimary font-medium">{profile.name}</p>
                </div>
              </div>
            )}

            {isVendor && (
              <>
                <div className="flex items-start gap-3">
                  <Building className="text-terracotta mt-1" size={20} />
                  <div>
                    <p className="text-textMuted text-sm mb-1">Shop Name</p>
                    <p className="text-textPrimary font-medium">{profile.shop_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-terracotta mt-1" size={20} />
                  <div>
                    <p className="text-textMuted text-sm mb-1">Location</p>
                    <p className="text-textPrimary font-medium">{profile.shop_location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-terracotta mt-1" size={20} />
                  <div>
                    <p className="text-textMuted text-sm mb-1">City</p>
                    <p className="text-textPrimary font-medium">{profile.city}</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-start gap-3">
              <Mail className="text-terracotta mt-1" size={20} />
              <div>
                <p className="text-textMuted text-sm mb-1">Email</p>
                <p className="text-textPrimary font-medium">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-terracotta mt-1" size={20} />
              <div>
                <p className="text-textMuted text-sm mb-1">Mobile</p>
                <p className="text-textPrimary font-medium">{profile.mobile}</p>
              </div>
            </div>

            {isVendor && (
              <div className="flex items-start gap-3 md:col-span-2">
                <FileText className="text-terracotta mt-1" size={20} />
                <div>
                  <p className="text-textMuted text-sm mb-1">Equipment Details</p>
                  <p className="text-textPrimary font-medium">{profile.equipment_details}</p>
                </div>
              </div>
            )}
          </div>

          {isVendor && profile.shop_images && profile.shop_images.length > 0 && (
            <div className="mt-8">
              <h3 className="font-heading text-xl font-semibold text-textPrimary mb-4">
                Shop Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile.shop_images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-warmSandSecondary">
                    <img
                      src={`${API}/files/${img}`}
                      alt={`Shop ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}