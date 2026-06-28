import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAVIGATION } from '../constants/testIds';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-header fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-heading text-3xl font-extrabold text-terracotta tracking-wide">
            UtsavNex
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
  to="/"
  className={`text-sm font-semibold ${
    isActive("/") ? "text-terracotta" : "text-textSecondary hover:text-terracotta"
  }`}
>
  Home
</Link>

<Link
  to="/categories"
  className="text-sm font-semibold text-textSecondary hover:text-terracotta"
>
  Categories
</Link>

<Link
  to="/vendors"
  className="text-sm font-semibold text-textSecondary hover:text-terracotta"
>
  Vendors
</Link>

<Link
  to="/about"
  className="text-sm font-semibold text-textSecondary hover:text-terracotta"
>
  About Us
</Link>

<Link
  to="/contact"
  className="text-sm font-semibold text-textSecondary hover:text-terracotta"
>
  Contact Us
</Link>

{isLoggedIn && (
  <Link
    to="/dashboard"
    className={`text-sm font-semibold ${
      isActive("/dashboard")
        ? "text-terracotta"
        : "text-textSecondary hover:text-terracotta"
    }`}
  >
    Dashboard
  </Link>
)}
              {isLoggedIn && (
              <Link
                data-testid={NAVIGATION.dashboardLink}
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard') ? 'text-terracotta' : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <button
                data-testid={NAVIGATION.logoutBtn}
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  data-testid={NAVIGATION.signInBtn}
                  to="/signin"
                  className="btn-secondary"
                >
                  Sign In
                </Link>
                <Link
                  data-testid={NAVIGATION.signUpBtn}
                  to="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-textPrimary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block text-sm font-medium ${
                isActive('/') ? 'text-terracotta' : 'text-textSecondary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              onClick={() => setIsOpen(false)}
              className={`block text-sm font-medium ${
                isActive('/events') ? 'text-terracotta' : 'text-textSecondary'
              }`}
            >
              Events
            </Link>
            {isLoggedIn && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-medium ${
                  isActive('/dashboard') ? 'text-terracotta' : 'text-textSecondary'
                }`}
              >
                Dashboard
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="btn-secondary w-full"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary block text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary block text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
