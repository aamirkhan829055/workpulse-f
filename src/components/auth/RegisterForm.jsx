import React, { useState } from 'react';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconAlertCircle,
  IconCheckCircle,
} from '../common/Icons';
import { registerApi } from '../../services/authService';

const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  // Handle Input Changes
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

  // Form Validation
  const validate = () => {
    const newErrors = {};

    // 1. Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // 2. Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // 3. Mobile Number validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10,12}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    // 4. Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // 5. Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // 6. Terms
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to company policies';
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

      // =======================================================================
      // 🚀 CONNECT YOUR REGISTER API HERE (services/authService.js)
      // =======================================================================
      const response = await registerApi({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setStatusMessage({
        type: 'success',
        text: response.message || 'Registration successful! Redirecting to login...',
      });

      setFormData({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
      });

      if (onRegisterSuccess) {
        onRegisterSuccess(response.user);
      }

      setTimeout(() => {
        onSwitchToLogin();
      }, 1600);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Registration failed. Please check details.',
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
          Create Employee Account
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Register to start tracking your daily attendance and shifts
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
        {/* 1. Full Name */}
        <div>
          <label
            htmlFor="register-name"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
              <IconUser size={18} />
            </span>
            <input
              id="register-name"
              name="name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              autoComplete="name"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all ${errors.name
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/30'
                : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-100'
                }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <IconAlertCircle size={13} />
              {errors.name}
            </p>
          )}
        </div>

        {/* 2. Work Email */}
        <div>
          <label
            htmlFor="register-email"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Work Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
              <IconMail size={18} />
            </span>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="name@company.com"
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

        {/* 3. Mobile Number */}
        <div>
          <label
            htmlFor="register-mobile"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Mobile Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
              <IconPhone size={18} />
            </span>
            <input
              id="register-mobile"
              name="mobile"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.mobile}
              onChange={handleChange}
              disabled={loading}
              autoComplete="tel"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all ${errors.mobile
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/30'
                : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-100'
                }`}
            />
          </div>
          {errors.mobile && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <IconAlertCircle size={13} />
              {errors.mobile}
            </p>
          )}
        </div>

        {/* 4. Password */}
        <div>
          <label
            htmlFor="register-password"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
              <IconLock size={18} />
            </span>
            <input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all ${errors.password
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/30'
                : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-100'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>

          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1.5 h-1.5 mb-1.5">
                <div
                  className={`flex-1 rounded-full transition-all ${strength.score >= 1 ? strength.color : 'bg-slate-200'
                    }`}
                />
                <div
                  className={`flex-1 rounded-full transition-all ${strength.score >= 2 ? strength.color : 'bg-slate-200'
                    }`}
                />
                <div
                  className={`flex-1 rounded-full transition-all ${strength.score >= 3 ? strength.color : 'bg-slate-200'
                    }`}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Password Strength:</span>
                <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <IconAlertCircle size={13} />
              {errors.password}
            </p>
          )}
        </div>

        {/* 5. Confirm Password */}
        <div>
          <label
            htmlFor="register-confirm-password"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
              <IconLock size={18} />
            </span>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all ${errors.confirmPassword
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/30'
                : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-100'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <IconAlertCircle size={13} />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              disabled={loading}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            <span>
              I agree to the company Attendance Policy, shift tracking guidelines, and Terms of Service.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <IconAlertCircle size={13} />
              {errors.agreeTerms}
            </p>
          )}
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <IconArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Switch Tab Prompt */}
      <div className="mt-6 text-center text-sm text-slate-600">
        Already have an account?
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-indigo-600 font-semibold hover:underline cursor-pointer ml-1 bg-transparent border-0"
        >
          Sign In here
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
