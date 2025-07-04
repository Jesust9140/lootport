import React from "react";
import { Navigate } from "react-router-dom";

// Simple authentication check that works with both backend and demo mode
const isUserAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = localStorage.getItem("user");
  
  // Return true if any authentication method is present
  return !!(token && user) || isLoggedIn;
};

export default function ProtectedRoute({ children }) {
  return isUserAuthenticated() ? children : <Navigate to="/login" replace />;
}
