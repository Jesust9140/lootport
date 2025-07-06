import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { loginUser, registerUser } from "../api/authAPI";
import { initiateSteamLogin, authenticateWithSteamId } from "../api/steamAPI";
import SteamIdInput from "../components/SteamIdInput";
import "../components/Styles/Auth.css";


export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showSteamInput, setShowSteamInput] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }

    const steamLogin = searchParams.get('steam_login');
    const steamId = searchParams.get('steam_id');
    const authError = searchParams.get('error');

    if (steamLogin === 'pending' && steamId) {
      navigate(`/steam-linking?steam_id=${steamId}`);
    } else if (authError) {
      switch (authError) {
        case 'steam_failed':
          setError('Steam authentication failed. Please try again.');
          break;
        case 'steam_callback_failed':
          setError('Steam authentication callback failed. Please try again.');
          break;
        case 'invalid_token':
          setError('Invalid authentication token. Please try again.');
          break;
        case 'invalid_steam_data':
          setError('Invalid Steam data. Please try again.');
          break;
        default:
          setError('Authentication failed. Please try again.');
      }
    }
  }, [location.pathname, searchParams, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const result = await loginUser(formData.email, formData.password);

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        window.dispatchEvent(new Event('authStateChanged'));

        if (result.user.role === 'admin') {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const result = await registerUser(formData.email, formData.password, formData.username);

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        window.dispatchEvent(new Event('authStateChanged'));

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

      // Use the real Steam OpenID login
      await initiateSteamLogin();

    } catch (error) {
      console.error("Steam login error:", error);
      setError("Steam login failed. Please try again or use the manual Steam ID option below.");
      setShowSteamInput(true);
      
      setTimeout(() => {
        const steamSection = document.querySelector('.steam-full-container');
        if (steamSection) {
          steamSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleSteamIdAuth = async (steamId64) => {
    try {
      setLoading(true);
      setError("");

      const result = await authenticateWithSteamId(steamId64);

      if (result.isNewUser) {
        navigate(`/steam-linking?steam_id=${result.steamProfile.steamId64}&display_name=${encodeURIComponent(result.steamProfile.displayName)}`);
      } else {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        window.dispatchEvent(new Event('authStateChanged'));

        if (result.user.role === 'admin') {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      }

    } catch (error) {
      console.error("Steam ID authentication error:", error);
      setError(error.message || "Steam authentication failed. Please check your Steam ID and try again.");
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
    <>
      {/* Auth page navbar */}
      <div className="auth-navbar">
        <Link to="/" className="auth-brand-link">
          <span className="auth-brand">Lootdrop</span>
        </Link>
      </div>

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

            {error && !showSteamInput && (
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

            {/* Steam login section (visible only on login mode) */}
            {isLogin && !showSteamInput && (
              <div className="steam-login-container">
                <div className="or-divider">
                  <span>or</span>
                </div>
                
                <button
                  className="steam-login-button"
                  onClick={handleSteamLogin}
                  disabled={loading}
                  type="button"
                >
                  {loading ? "Connecting to Steam..." : "🎮 Sign In with Steam"}
                </button>
              </div>
            )}

            {/* Steam manual authentication - separate container */}
            {isLogin && showSteamInput && (
              <div className="steam-full-container">
                <div className="steam-section-header">
                  <h3>🎮 Alternative Steam Login</h3>
                  <p>If Steam OpenID doesn't work, you can authenticate manually with your Steam ID</p>
                </div>
                <div className="steam-manual-auth">
                  <div className="steam-notice">
                    <h4>Manual Steam Authentication</h4>
                    <p>Enter your Steam ID64 or Steam profile URL:</p>
                    
                    {/* Try Steam login again button */}
                    <div className="steam-retry-section">
                      <button 
                        type="button" 
                        className="steam-retry-button"
                        onClick={handleSteamLogin}
                        disabled={loading}
                      >
                        🎮 Try "Sign in with Steam" Again
                      </button>
                      <span className="steam-retry-text">or</span>
                    </div>
                    
                    <button 
                      type="button" 
                      className="close-steam-input"
                      onClick={() => {
                        setShowSteamInput(false);
                        setError('');
                        // Scroll back to the Steam login section
                        setTimeout(() => {
                          const steamLoginSection = document.querySelector('.steam-login-container');
                          if (steamLoginSection) {
                            steamLoginSection.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center'
                            });
                          }
                        }, 100);
                      }}
                      disabled={loading}
                    >
                      ✕ Back to Login Options
                    </button>
                  </div>
                  <SteamIdInput 
                    onSteamAuth={handleSteamIdAuth}
                    loading={loading}
                  />
                  
                  {error && (
                    <div className="error-message" style={{marginTop: '1rem'}}>
                      {error}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional links for login mode */}
            {isLogin && (
              <div className="auth-links">
                <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    const email = prompt("Please enter your email address for password reset:");
                    if (email) {
                      alert(`Password reset instructions will be sent to ${email}. Contact support at jesust9140@gmail.com if you don't receive them.`);
                    }
                  }}
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    const email = prompt("Please enter your email address to recover your username:");
                    if (email) {
                      alert(`Your username will be sent to ${email}. Contact support at jesust9140@gmail.com if you don't receive it.`);
                    }
                  }}
                >
                  Forgot Username?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}