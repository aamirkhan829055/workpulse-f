import React, { useState } from 'react';
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconAlertCircle,
  IconCheckCircle,
} from '../common/Icons';
import { loginApi } from '../../services/authService';
import ForgotPasswordModal from './ForgotPasswordModal';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSwitchToRegister, onLoginSuccess }) => {
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // UI States

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setStatusMessage({ type: '', text: '' });

      const response = await loginApi({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      // Save token and user in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      setStatusMessage({
        type: 'success',
        text: response.message || 'Login successful! Welcome back.',
      });

      if (onLoginSuccess) {
        onLoginSuccess(response.user);
      }

      navigate('/dashboard');
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Invalid email or password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
          Sign In to Your Account
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Access your employee attendance portal and work tracker
        </p>
      </div>

      {/* Alert Notification */}
      {statusMessage.text && (
        <div
          className={`flex items-start gap-2.5 p-3.5 rounded-xl text-sm mb-5 transition-all ${statusMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
        >
          {statusMessage.type === 'success' ? (
            <IconCheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <IconAlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
              <IconMail size={18} />
            </span>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="e.g. employee@company.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all ${errors.email
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/30'
                : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-100'
                }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <IconAlertCircle size={13} />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
              <IconLock size={18} />
            </span>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all ${errors.password
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/30'
                : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-100'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <IconAlertCircle size={13} />
              {errors.password}
            </p>
          )}
        </div>

        {/* Options Row: Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => setIsForgotModalOpen(true)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <IconArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Switch Tab Prompt */}
      <div className="mt-6 text-center text-sm text-slate-600">
        Don't have an account?
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-indigo-600 font-semibold hover:underline cursor-pointer ml-1 bg-transparent border-0"
        >
          Create an Account
        </button>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </>
  );
};

export default LoginForm;
