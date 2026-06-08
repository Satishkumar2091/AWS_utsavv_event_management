import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function VendorProfile() {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendor();
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      const response = await axios.get(`${API}/vendors/${vendorId}`);
      setVendor(response.data);
    } catch (error) {
      console.error('Error fetching vendor:', error);
    }
    setLoading(false);
  };

  const nextImage = () => {
    if (vendor.shop_images && vendor.shop_images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % vendor.shop_images.length);
    }
  };

  const prevImage = () => {
    if (vendor.shop_images && vendor.shop_images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + vendor.shop_images.length) % vendor.shop_images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-textSecondary">Loading...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-textSecondary">Vendor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary mb-8 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {vendor.shop_images && vendor.shop_images.length > 0 ? (
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-warmSandSecondary">
                  <img
                    src={`${API}/files/${vendor.shop_images[currentImageIndex]}`}
                    alt={vendor.shop_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {vendor.shop_images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all"
                    >
                      <ChevronLeft className="text-textPrimary" size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all"
                    >
                      <ChevronRight className="text-textPrimary" size={20} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {vendor.shop_images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-square rounded-2xl bg-warmSandSecondary flex items-center justify-center">
                <p className="text-textMuted">No images available</p>
              </div>
            )}

            {/* Thumbnail Grid */}
            {vendor.shop_images && vendor.shop_images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {vendor.shop_images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? 'border-terracotta'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={`${API}/files/${img}`}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vendor Details */}
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-textPrimary mb-4">
              {vendor.shop_name}
            </h1>

            <div className="flex items-center gap-2 text-textSecondary mb-8">
              <MapPin size={20} />
              <span className="text-lg">{vendor.city}</span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-forestGreen/10 mb-6">
              <h2 className="font-heading text-xl font-semibold text-textPrimary mb-4">
                About
              </h2>
              <p className="text-textSecondary leading-relaxed">
                {vendor.equipment_details}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-forestGreen/10 mb-6">
              <h2 className="font-heading text-xl font-semibold text-textPrimary mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
                    <Mail className="text-terracotta" size={18} />
                  </div>
                  <div>
                    <p className="text-textMuted text-sm">Email</p>
                    <p className="text-textPrimary font-medium">{vendor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
                    <Phone className="text-terracotta" size={18} />
                  </div>
                  <div>
                    <p className="text-textMuted text-sm">Phone</p>
                    <p className="text-textPrimary font-medium">{vendor.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
                    <MapPin className="text-terracotta" size={18} />
                  </div>
                  <div>
                    <p className="text-textMuted text-sm">Address</p>
                    <p className="text-textPrimary font-medium">{vendor.shop_location}</p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href={`tel:${vendor.mobile}`}
              className="btn-primary w-full text-center block py-4 text-lg"
            >
              Contact Vendor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}