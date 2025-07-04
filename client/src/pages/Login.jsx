import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      const result = await loginUser(email, password);
      
      // Store auth data in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      
      // Redirect based on user role
      if (result.user.role === 'admin') {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
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
          
          <div className="auth-links">
            <div className="link-row">
              <button 
                type="button" 
                className="link-button forgot-link"
                onClick={() => alert("Password reset feature coming soon! Contact support at jesust9140@gmail.com")}
              >
                Forgot Password?
              </button>
              <button 
                type="button" 
                className="link-button forgot-link"
                onClick={() => alert("Username recovery feature coming soon! Contact support at jesust9140@gmail.com")}
              >
                Forgot Username?
              </button>
            </div>
            
            <div className="signup-section">
              <p>Don't have an account?</p>
              <button 
                type="button" 
                className="signup-button"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </div>
          </div>
          
          <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#9ca3af" }}>
            <strong>Note:</strong> Admin access is restricted to jesust9140@gmail.com
          </p>
        </div>
      </main>
    </div>
  );
}
