// ===========================================
// MAIN APP COMPONENT
// ===========================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Wall from './components/Wall';

function App() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1>🎀 PookiePing</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/wall" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/wall" /> : <Register />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/wall" 
          element={isAuthenticated ? <Wall /> : <Navigate to="/login" />} 
        />
        
        {/* Default redirect */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/wall" : "/login"} />} 
        />
      </Routes>
    </div>
  );
}

export default App;
