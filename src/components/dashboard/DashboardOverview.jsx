import React from 'react';
import {
  IconUsers,
  IconClock,
  IconCheckCircle,
  IconAlertCircle,
  IconCalendar,
} from '../common/Icons';

const DashboardOverview = ({ onNavigateToEmployees }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Admin Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to WorkPulse Dashboard
          </h2>
          <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
            Track daily employee attendance, monitor active work sessions, and streamline your workforce management.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={onNavigateToEmployees}
              className="px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold text-sm rounded-xl transition cursor-pointer shadow-sm"
            >
              View Employee Directory
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-8 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <IconUsers size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Employees
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">24</h3>
            <span className="text-xs text-emerald-600 font-medium">All registered</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <IconCheckCircle size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Present Today
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">21</h3>
            <span className="text-xs text-emerald-600 font-medium">87.5% attendance</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <IconAlertCircle size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              On Leave
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">3</h3>
            <span className="text-xs text-amber-600 font-medium">Planned leaves</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <IconClock size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Average Hours
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">7.8 hrs</h3>
            <span className="text-xs text-slate-500 font-medium">Per employee today</span>
          </div>
        </div>
      </div>

      {/* Quick Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Recent Attendance Logs</h3>
            <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">
              View All
            </span>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Aarav Sharma', id: 'EMP-1001', time: '09:02 AM', status: 'On Time' },
              { name: 'Priya Patel', id: 'EMP-1002', time: '09:15 AM', status: 'On Time' },
              { name: 'Vikram Singh', id: 'EMP-1005', time: '09:42 AM', status: 'Late (12m)' },
              { name: 'Ananya Gupta', id: 'EMP-1004', time: '08:55 AM', status: 'Early' },
            ].map((log, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center">
                    {log.name[0]}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block leading-tight">
                      {log.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{log.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-medium text-slate-600 block">
                    {log.time}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      log.status.startsWith('Late') ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Today's Schedule</h3>
            <p className="text-xs text-slate-500 mb-4">
              Overview of shifts and team meetings for today.
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-xs font-bold text-indigo-700">General Shift</span>
                <p className="text-xs text-slate-600 mt-0.5">09:00 AM - 06:00 PM (18 Active)</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-700">Evening Shift</span>
                <p className="text-xs text-slate-600 mt-0.5">02:00 PM - 11:00 PM (3 Active)</p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 mt-4">
            <IconCalendar size={16} className="text-slate-400" />
            <span>Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
