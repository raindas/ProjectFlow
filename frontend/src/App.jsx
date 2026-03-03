import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Verify from './pages/Verify';
import Settings from './pages/Settings'; // 1. Import the Settings component!

// Simple guard: check if token exists
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('pf_token');
  return token ? children : <Navigate to="/login" />;
};

// 2. Extract Layout so the Navbar is shared across pages
const Layout = ({ children }) => (
  <>
    <nav className="bg-white border-b p-4 mb-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="font-bold text-xl">ProjectFlow</span>
        <div className="space-x-6 text-sm font-medium">
          {/* 3. Use Link instead of a tags for fast SPA routing */}
          <Link to="/" className="hover:text-gray-500">Dashboard</Link>
          <Link to="/settings" className="hover:text-gray-500">Settings</Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-bold border-l pl-6 ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
    {children}
  </>
);

const handleLogout = () => {
  localStorage.removeItem('pf_token');
  localStorage.removeItem('pf_user_email');
  window.location.href = '/login'; // Full refresh to clear state
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />

          {/* Dashboard Route */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Settings Route (This is what was missing!) */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;