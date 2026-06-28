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
          <Link to="/" className="font-heading text-2xl font-bold text-textPrimary">
            UtsavNex
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              data-testid={NAVIGATION.homeLink}
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-terracotta' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              Home
            </Link>
            <div className="relative group">
  <button className="text-sm font-medium text-textSecondary hover:text-textPrimary">
    Categories ▼
  </button>

  <div className="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-3 w-72 border z-50">

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Wedding</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Engagement</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Birthday Party</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Housewarming</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Baby Shower</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Naming Ceremony</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Haldi Ceremony</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Mehendi</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Reception</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Temple Events</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Corporate Events</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">College Fest</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">School Events</Link>

    <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Cultural Programs</Link>

  </div>
</div>
<Link
    to="/vendors"
    className="text-sm font-medium text-textSecondary hover:text-textPrimary"
>
    Vendors
</Link>

<Link
    to="/about"
    className="text-sm font-medium text-textSecondary hover:text-textPrimary"
>
    About
</Link>

<Link
    to="/contact"
    className="text-sm font-medium text-textSecondary hover:text-textPrimary"
>
    Contact
</Link>
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
