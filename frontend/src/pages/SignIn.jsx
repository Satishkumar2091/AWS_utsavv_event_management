import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AUTH } from '@/constants/testIds';
import { Mail, Lock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.user_type);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-16 px-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-textPrimary mb-4">
            Welcome Back
          </h1>
          <p className="text-textSecondary text-lg">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-forestGreen/10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                <Mail className="inline mr-2" size={16} />
                Email Address
              </label>
              <input
                data-testid={AUTH.emailInput}
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-field"
                placeholder="your@email.com"
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-textSecondary">
              Don't have an account?{' '}
              <Link to="/signup" className="text-terracotta font-medium hover:text-terracottaHover">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}