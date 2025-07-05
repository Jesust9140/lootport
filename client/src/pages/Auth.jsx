import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser } from "../api/authAPI";
import "../components/Styles/Auth.css";


export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set initial mode based on URL
  useEffect(() => {
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        const result = await loginUser(formData.email, formData.password);
        
        // Store auth data
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        
        // Trigger auth state change event for navbar
        window.dispatchEvent(new Event('authStateChanged'));
        
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const result = await registerUser(formData.email, formData.password, formData.username);
        
        // Store auth data
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        
        // Trigger auth state change event for navbar
        window.dispatchEvent(new Event('authStateChanged'));
        
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      setError(error.message || `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSteamLogin = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Enhanced Steam OAuth simulation with account creation
      const mockSteamData = {
        steamId: '76561198' + Math.floor(Math.random() * 100000000),
        steamUsername: 'SteamUser' + Math.floor(Math.random() * 1000),
        steamProfileUrl: 'https://steamcommunity.com/profiles/76561198' + Math.floor(Math.random() * 100000000),
        profilePicture: 'https://avatars.steamstatic.com/default_full.jpg',
        email: 'steamuser' + Math.floor(Math.random() * 1000) + '@steam.local'
      };
      
      // Create or login user via Steam
      const mockUser = {
        id: 'steam_' + mockSteamData.steamId,
        email: mockSteamData.email,
        username: mockSteamData.steamUsername,
        role: 'customer',
        steamId: mockSteamData.steamId,
        steamProfileUrl: mockSteamData.steamProfileUrl,
        profilePicture: mockSteamData.profilePicture,
        bio: 'Steam user',
        location: '',
        joinDate: new Date().toISOString()
      };
      
      // Store authentication data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authToken", "steam_mock_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("steamUser", JSON.stringify(mockSteamData));
      
      // Trigger auth state change event for navbar
      window.dispatchEvent(new Event('authStateChanged'));
      
      navigate("/profile");
    } catch (error) {
      setError("Steam login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      email: "",
      password: "",
      username: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header with toggle */}
        <div className="auth-header">
          {/* <button 
            className="back-button" 
            onClick={() => navigate("/")}
            aria-label="Back to home"
          >
            ← LootDrop
          </button> */}
          
          <div className="auth-toggle">
            <button 
              className={`toggle-btn ${isLogin ? 'active' : ''}`}
              onClick={() => !isLogin && toggleMode()}
            >
              Sign In
            </button>
            <button 
              className={`toggle-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => isLogin && toggleMode()}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="auth-form-container">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="auth-subtitle">
            {isLogin 
              ? "Sign in to access your inventory and notifications" 
              : "Join Lootdrop to manage your CS2 skins and get updates"
            }
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group" style={{ '--delay': '0.1s' }}>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            <div className="input-group" style={{ '--delay': !isLogin ? '0.2s' : '0.1s' }}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group" style={{ '--delay': !isLogin ? '0.3s' : '0.2s' }}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div className="input-group" style={{ '--delay': '0.4s' }}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
              style={{ '--delay': !isLogin ? '0.5s' : '0.3s' }}
            >
              {loading ? 
                (isLogin ? "Signing In..." : "Creating Account...") :
                (isLogin ? "Sign In" : "Create Account")
              }
            </button>
          </form>

          {/* Steam login button (visible only on login mode) */}
          {isLogin && (
            <div className="steam-login-container">
              <button 
                className="steam-login-button"
                onClick={handleSteamLogin}
                disabled={loading}
              >
                {loading ? "Signing in with Steam..." : "Sign In with Steam"}
              </button>
            </div>
          )}

          {/* Additional links for login mode */}
          {isLogin && (
            <div className="auth-links">
              <button 
                type="button" 
                className="link-button"
                onClick={() => alert("Password reset feature coming soon! Contact support at jesust9140@gmail.com")}
              >
                Forgot Password?
              </button>
              <button 
                type="button" 
                className="link-button"
                onClick={() => alert("Username recovery feature coming soon! Contact support at jesust9140@gmail.com")}
              >
                Forgot Username?
              </button>
            </div>
          )}

          {/* Admin note */}
          <div className="admin-note">
            <p>Admin access is restricted to jesust9140@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
