import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { linkSteamAccount, registerWithSteam } from '../api/steamAPI';

const SteamLinking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState('link'); // 'link' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    username: ''
  });

  const steamId64 = searchParams.get('steam_id');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (!steamId64) {
      navigate('/auth?error=invalid_steam_data');
      return;
    }

    // If user is already logged in, default to linking mode
    // Otherwise, default to registration mode
    setMode(isLoggedIn ? 'link' : 'register');
  }, [steamId64, isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLinkAccount = async () => {
    try {
      setLoading(true);
      setError('');

      await linkSteamAccount(steamId64);
      
      // Show success message and redirect
      alert('Steam account linked successfully!');
      navigate('/profile');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterWithSteam = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.username) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result = await registerWithSteam(steamId64, formData.email, formData.username);
      
      // Store auth data
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Trigger auth state change
      window.dispatchEvent(new Event('authStateChanged'));
      
      // Redirect to profile
      navigate('/profile');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <div className="steam-linking-header">
          <h2>🎮 Steam Account Setup</h2>
          <p>Complete your Steam authentication</p>
        </div>

        {mode === 'link' && isLoggedIn && (
          <div className="link-mode">
            <h3>Link Steam Account</h3>
            <p>Link your Steam account to your existing LootDrop account.</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="button-group">
              <button 
                className="btn btn-primary"
                onClick={handleLinkAccount}
                disabled={loading}
              >
                {loading ? 'Linking...' : 'Link Steam Account'}
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/auth')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {mode === 'register' && (
          <div className="register-mode">
            <h3>Create Account with Steam</h3>
            <p>Complete your account setup to continue.</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleRegisterWithSteam}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="button-group">
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/auth')}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>

            {!isLoggedIn && (
              <div className="mode-switch">
                <p>Already have an account? <button className="link-button" onClick={() => navigate('/auth')}>Sign in first</button></p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SteamLinking;
