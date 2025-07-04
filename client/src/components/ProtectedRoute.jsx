import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Simple authentication check that works with both backend and demo mode
const isUserAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = localStorage.getItem("user");
  
  // Return true if any authentication method is present
  return !!(token && user) || isLoggedIn;
};

// Check if user is admin
const isUserAdmin = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    
    const user = JSON.parse(userStr);
    return user.role === 'admin' && user.email.toLowerCase() === 'jesust9140@gmail.com';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  
  // Check if user is authenticated
  if (!isUserAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  
  // If route requires admin access, check admin status
  if (adminOnly || location.pathname === '/dashboard') {
    if (!isUserAdmin()) {
      // Redirect non-admin users to their profile page
      return <Navigate to="/profile" replace />;
    }
  }
  
  return children;
}
