import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import DashboardOverview from './dashboard/DashboardOverview';
import EmployeeList from './employee/EmployeeList';
import { logoutApi } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'employee'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Security check: Agar token nahi hai to dashboard render hi na ho
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await logoutApi(token);
      }

      alert("Logout successfully!");
    } catch (error) {
      console.error("Logout Error:", error);
      alert(error.message || "Something went wrong during logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Breadcrumb / Active Screen Label */}
            <div>
              <span className="text-xs text-slate-400 font-medium capitalize">WorkPulse / </span>
              <span className="text-sm font-bold text-slate-800 capitalize">
                {activeTab === 'dashboard' ? 'Dashboard Overview' : 'Employee Management'}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/60 rounded-xl transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Dynamic Page View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' ? (
            <DashboardOverview onNavigateToEmployees={() => setActiveTab('employee')} />
          ) : (
            <EmployeeList />
          )}
        </main>
      </div>

    </div>
  );
};

export default Dashboard;
