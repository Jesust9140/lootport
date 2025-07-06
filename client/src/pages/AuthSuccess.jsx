import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthSuccess = () => {
      const token = searchParams.get('token');
      
      if (token) {
        // Store the token and redirect to dashboard
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Trigger auth state change event
        window.dispatchEvent(new Event('authStateChanged'));
        
        // Redirect to profile
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } else {
        // No token found, redirect to auth page
        navigate('/auth?error=invalid_token');
      }
      
      setLoading(false);
    };

    handleAuthSuccess();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="auth-success-container">
        <div className="auth-success-content">
          <div className="loading-spinner"></div>
          <h2>Logging you in...</h2>
          <p>Please wait while we complete your Steam authentication.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-success-container">
      <div className="auth-success-content">
        <div className="success-icon">✅</div>
        <h2>Authentication Successful!</h2>
        <p>Redirecting you to your profile...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
