import { useState, useEffect } from "react";

export default function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("authToken");
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const user = localStorage.getItem("user");
      
      setDebugInfo({
        authToken: authToken ? "Present" : "Missing",
        isLoggedIn: isLoggedIn || "false",
        user: user ? "Present" : "Missing",
        userParsed: user ? JSON.parse(user) : null,
        timestamp: new Date().toLocaleTimeString()
      });
    };

    checkAuth();
    
    // Check every 2 seconds
    const interval = setInterval(checkAuth, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    window.location.reload();
  };

  return (
    <div style={{
      position: "fixed",
      top: "120px", 
      right: "10px",
      background: "rgba(0,0,0,0.8)",
      color: "white",
      padding: "1rem",
      borderRadius: "8px",
      fontSize: "12px",
      zIndex: 9999,
      maxWidth: "300px"
    }}>
      <h4 style={{ margin: "0 0 10px 0" }}>🔍 Auth Debug</h4>
      <div><strong>Auth Token:</strong> {debugInfo.authToken}</div>
      <div><strong>Is Logged In:</strong> {debugInfo.isLoggedIn}</div>
      <div><strong>User Data:</strong> {debugInfo.user}</div>
      {debugInfo.userParsed && (
        <div><strong>Username:</strong> {debugInfo.userParsed.username}</div>
      )}
      <div><strong>Last Check:</strong> {debugInfo.timestamp}</div>
      <button 
        onClick={clearAuth}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "11px"
        }}
      >
        Clear Auth & Reload
      </button>
    </div>
  );
}
