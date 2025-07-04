import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/authAPI";
import "../components/Styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Simple fallback authentication for demo purposes
      if (email === "admin@lootdrop.com" && password === "admin123") {
        // Create mock user data
        const mockUser = {
          id: "1",
          username: "Admin", 
          email: "admin@lootdrop.com",
          joinDate: new Date().toISOString()
        };
        
        // Store auth data in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authToken", "mock-token-123");
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        // Redirect to dashboard
        navigate("/dashboard");
        return;
      }
      
      // Try backend authentication
      try {
        await loginUser(email, password);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } catch (backendError) {
        // If backend fails, show helpful error
        if (email && password) {
          setError("Backend server not running. Try: admin@lootdrop.com / admin123 for demo mode.");
        } else {
          setError("Please enter email and password");
        }
      }
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <main className="page-content">
        <div className="login-container">
               {/* Close Button */}
          
<div className="button-wrapper">
  <button className="lootdrop-button" onClick={() => navigate("/")}>Lootdrop</button>
  <button className="close-button" onClick={() => navigate("/")}>✕</button>
</div>
          <h2>Login to Your Account</h2>
          
          {error && (
            <div style={{ 
              color: "#ef4444", 
              background: "rgba(239, 68, 68, 0.1)", 
              padding: "0.75rem", 
              borderRadius: "6px", 
              marginBottom: "1rem",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}
          
          <form className="login-form" onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={loading}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#9ca3af" }}>
            <strong>Demo credentials:</strong> admin@lootdrop.com / admin123
          </p>
          
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#6b7280" }}>
            💡 If backend is not running, demo mode will be used automatically
          </p>
        </div>
      </main>
    </div>
  );
}
