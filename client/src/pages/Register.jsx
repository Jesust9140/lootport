import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authAPI";
import "../components/Styles/Register.css";
import "../components/Styles/Login.css"; // Import for shared button styles

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      console.log("Registering with:", { username, email, password });
      
      // Call the backend API to register the user
      const result = await registerUser(email, password, username);
      
      console.log("Registration successful:", result);
      
      // Store authentication data
      localStorage.setItem("isLoggedIn", "true");
      if (result.user) {
        localStorage.setItem("userEmail", result.user.email);
      }
      
      // Navigate based on role
      if (result.user.role === 'admin') {
        navigate("/dashboard");
      } else {
        navigate("/profile"); // Customer profile page
      }
    } catch (err) {
      setError(err.message || "Failed to register. That username or email may already be taken.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <main className="page-content">
        <div className="register-container">
          <div className="button-wrapper">
            <button className="lootdrop-button" onClick={() => navigate("/")}>Lootdrop</button>
            <button className="close-button" onClick={() => navigate("/")}>✕</button>
          </div>

          <h2>Create Your Account</h2>
          {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
          <form className="register-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
          
          <div className="auth-links">
            <div className="login-section">
              <p>Already have an account?</p>
              <button 
                type="button" 
                className="login-button"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
