import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("steamUser");
    
    // Trigger auth state change event
    window.dispatchEvent(new Event('authStateChanged'));
    
    setIsOpen(false);
    navigate('/');
  };

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile menu"
      >
        <img 
          src={user.profilePicture || 'https://via.placeholder.com/40?text=User'} 
          alt="Profile"
          className="profile-avatar"
        />
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <img 
              src={user.profilePicture || 'https://via.placeholder.com/50?text=User'} 
              alt="Profile"
              className="dropdown-avatar"
            />
            <div className="user-info">
              <div className="username">{user.username}</div>
              <div className="user-email">{user.email}</div>
              <div className="user-role">{user.role === 'admin' ? 'Administrator' : 'Customer'}</div>
            </div>
          </div>

          <div className="dropdown-divider" />

          <div className="dropdown-section">
            <Link to="/profile" className="dropdown-item" onClick={handleMenuClick}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="item-icon">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              My Profile
            </Link>

            {user.role === 'admin' ? (
              <Link to="/dashboard" className="dropdown-item" onClick={handleMenuClick}>
                <svg viewBox="0 0 20 20" fill="currentColor" className="item-icon">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Admin Dashboard
              </Link>
            ) : (
              <Link to="/inventory" className="dropdown-item" onClick={handleMenuClick}>
                <svg viewBox="0 0 20 20" fill="currentColor" className="item-icon">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9z" clipRule="evenodd" />
                </svg>
                My Inventory
              </Link>
            )}

            <Link to="/profile?tab=settings" className="dropdown-item" onClick={handleMenuClick}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="item-icon">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Settings
            </Link>
          </div>

          <div className="dropdown-divider" />

          <div className="dropdown-section">
            <button className="dropdown-item help-item" onClick={() => {
              handleMenuClick();
              window.open('mailto:jesust9140@gmail.com?subject=Lootdrop Help Request', '_blank');
            }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="item-icon">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Help & Contact
            </button>

            <button className="dropdown-item logout-item" onClick={handleLogout}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="item-icon">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
