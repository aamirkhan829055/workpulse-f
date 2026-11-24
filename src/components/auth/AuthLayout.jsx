import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { IconBuilding, IconSparkles, IconUser } from '../common/Icons';

const AuthLayout = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const navigate = useNavigate();

  // Agar user already logged in hai to seedha dashboard par bhejo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 font-sans">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-3">
          <IconBuilding size={24} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
          WorkPulse
        </h2>
        <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 mt-0.5">
          Attendance Portal
        </span>
      </div>

      {/* Main Centered Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200/90 p-7 sm:p-10">
        {/* Segmented Switcher Tabs */}
        <div className="flex p-1 bg-slate-100/90 rounded-2xl mb-7 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <IconUser size={16} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <IconSparkles size={16} />
            <span>Register</span>
          </button>
        </div>

        {/* Active Screen Form */}
        {activeTab === 'login' ? (
          <LoginForm
            onSwitchToRegister={() => setActiveTab('register')}
            onLoginSuccess={(user) => {
              console.log('Logged in user:', user);
            }}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setActiveTab('login')}
            onRegisterSuccess={(user) => {
              console.log('Registered user:', user);
            }}
          />
        )}
      </div>

      {/* Footer copyright / security note */}
      <p className="text-xs text-slate-400 mt-6 text-center">
        © 2026 WorkPulse. Secure Employee Attendance Management System.
      </p>
    </div>
  );
};

export default AuthLayout;
