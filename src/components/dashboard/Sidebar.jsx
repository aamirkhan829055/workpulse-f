import React from 'react';
import {
  IconLayoutDashboard,
  IconUsers,
  IconX,
} from '../common/Icons';

const Sidebar = ({ activeTab, onSelectTab, isOpen, onClose }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: IconLayoutDashboard,
      badge: null,
    },
    {
      id: 'employee',
      label: 'Employee',
      icon: IconUsers,
      badge: '5',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              W
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-base leading-tight">WorkPulse</h1>
              <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                HR Portal
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={isActive ? 'text-white' : 'text-slate-400'}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive
                        ? 'bg-indigo-500/40 text-white'
                        : 'bg-slate-100 text-slate-600'
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">Admin User</p>
              <p className="text-[11px] text-slate-400 truncate">admin@workpulse.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
