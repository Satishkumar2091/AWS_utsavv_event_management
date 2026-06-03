import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
import axios from 'axios';
import { HOME } from '@/constants/testIds';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Home() {
  const [vendors, setVendors] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async (city = '') => {
    setLoading(true);
    try {
      const url = city ? `${API}/vendors?city=${encodeURIComponent(city)}` : `${API}/vendors`;
      const response = await axios.get(url);
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchVendors(searchCity);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1527529482837-4698179dc6ce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxldmVudCUyMGNlbGVicmF0aW9uJTIwcGVvcGxlfGVufDB8fHx8MTc4MDQ5NjAwMnww&ixlib=rb-4.1.0&q=85)` }}
      >
        <div className="hero-gradient absolute inset-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-none mb-6">
            Find Perfect Vendors<br />For Your Event
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Connect with trusted event vendors - photographers, caterers, decorators, and more
          </p>
          
          {/* Search Bar */}
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 text-textMuted" size={20} />
              <input
                data-testid={HOME.searchInput}
                type="text"
                placeholder="Enter city or location..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-14 pr-6 py-4 rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 text-textPrimary font-body"
              />
            </div>
            <button
              data-testid={HOME.searchBtn}
              onClick={handleSearch}
              className="btn-primary flex items-center gap-2 px-8"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Categories Marquee */}
      <div className="bg-forestGreen py-4 overflow-hidden">
        <div className="marquee whitespace-nowrap">
          <span className="inline-block px-8 text-white text-sm uppercase tracking-widest">Photography</span>
          <span className="inline-block px-8 text-white/60">•</span>
          <span className="inline-block px-8 text-white text-sm uppercase tracking-widest">Catering</span>
          <span className="inline-block px-8 text-white/60">•</span>
          <span className="inline-block px-8 text-white text-sm uppercase tracking-widest">Decoration</span>
          <span className="inline-block px-8 text-white/60">•</span>
          <span className="inline-block px-8 text-white text-sm uppercase tracking-widest">DJ & Music</span>
          <span className="inline-block px-8 text-white/60">•</span>
          <span className="inline-block px-8 text-white text-sm uppercase tracking-widest">Venue</span>
          <span className="inline-block px-8 text-white/60">•</span>
          <span className="inline-block px-8 text-white text-sm uppercase tracking-widest">Photography</span>
          <span className="inline-block px-8 text-white/60">•</span>
          <span className="inline-block px-8 text-white text-sm uppercase tracking-widest">Catering</span>
          <span className="inline-block px-8 text-white/60">•</span>
          <span className="inline-block px-8 text-white text-sm uppercase tracking-widest">Decoration</span>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-12 text-textPrimary">
          {searchCity ? `Vendors in ${searchCity}` : 'Featured Vendors'}
        </h2>
        
        {loading ? (
          <p className="text-textSecondary">Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-textSecondary text-lg mb-4">No vendors found</p>
            <p className="text-textMuted">Try searching in a different location</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                data-testid={HOME.vendorCard}
                className="bg-white rounded-2xl overflow-hidden border border-forestGreen/10 card-hover cursor-pointer"
                onClick={() => navigate(`/vendor/${vendor.id}`)}
              >
                <div className="aspect-[4/3] bg-warmSandSecondary overflow-hidden">
                  {vendor.shop_images && vendor.shop_images.length > 0 ? (
                    <img
                      src={`${API}/files/${vendor.shop_images[0]}`}
                      alt={vendor.shop_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-textMuted">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-textPrimary mb-2">
                    {vendor.shop_name}
                  </h3>
                  <div className="flex items-center gap-2 text-textSecondary text-sm mb-3">
                    <MapPin size={16} />
                    <span>{vendor.city}</span>
                  </div>
                  <p className="text-textMuted text-sm mb-4 line-clamp-2">
                    {vendor.equipment_details}
                  </p>
                  <button
                    data-testid={HOME.viewVendorBtn}
                    className="btn-secondary w-full text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}