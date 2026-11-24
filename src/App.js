import React from 'react';
import AuthLayout from './components/auth/AuthLayout';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AuthLayout />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
