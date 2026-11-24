import React, { useState } from 'react';
import { IconMail, IconX, IconCheckCircle, IconAlertCircle } from '../common/Icons';
import { forgotPasswordApi } from '../../services/authService';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your registered email address.' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: '', message: '' });

      // 🚀 USER CAN PLUG IN REAL API HERE
      const res = await forgotPasswordApi(email);

      setStatus({
        type: 'success',
        message: res.message || 'Password reset link sent! Please check your inbox.',
      });
      setEmail('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to send reset link. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <IconX size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 border border-indigo-100 shadow-sm">
            <IconMail size={24} />
          </div>
          <h4 className="text-xl font-bold text-slate-800">Reset Your Password</h4>
          <p className="text-sm text-slate-500 mt-1">
            Enter your registered work email to receive password reset instructions.
          </p>
        </div>

        {/* Alert notification */}
        {status.message && (
          <div
            className={`flex items-start gap-2.5 p-3.5 rounded-xl text-sm mb-5 ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {status.type === 'success' ? (
              <IconCheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <IconAlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <IconMail size={18} />
              </span>
              <input
                id="reset-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-100 focus:ring-4 focus:ring-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
