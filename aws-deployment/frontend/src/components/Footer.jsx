import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forestGreen text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">EventHub</h3>
            <p className="text-white/80 text-sm">
              Your trusted marketplace for event vendors and services.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-white/80 hover:text-white text-sm transition-colors">
                Home
              </Link>
              <Link to="/events" className="block text-white/80 hover:text-white text-sm transition-colors">
                Events
              </Link>
              <Link to="/signup" className="block text-white/80 hover:text-white text-sm transition-colors">
                Sign Up
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">For Vendors</h4>
            <div className="space-y-2">
              <Link to="/signup" className="block text-white/80 hover:text-white text-sm transition-colors">
                Register as Vendor
              </Link>
              <Link to="/dashboard" className="block text-white/80 hover:text-white text-sm transition-colors">
                Vendor Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}