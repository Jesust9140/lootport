// import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAuthenticated, logoutUser } from '../api/authAPI';
import NotificationDropdown from './NotificationDropdown';
import './Navbar.css';
import MoreDropdown from './MoreDropdown';

const categories = [
  'Knife', 'Gloves', 'Pistol', 'Rifle', 'SMG', 'Heavy',
  'Agent', 'Charm', 'Sticker', 'Container', 'Key', 'Patch',
  'Graffiti', 'Collectible', 'Pass', 'Music Kit',
];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is authenticated using multiple methods
    const token = localStorage.getItem("authToken");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = localStorage.getItem("user");
    
    setIsLoggedIn(!!(token && user) || isLoggedIn);
  }, []);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    
    setIsLoggedIn(false);
    window.location.href = "/"; // Redirect to home
  };

  return (
    <>
      <div className="topbar">
        <div className="left">
          <Link to="/" className="brand-link">
            {/* <img src={logo} alt="Lootdrop Logo" className="logo" /> */}
            <span className="brand">Lootdrop</span>
          </Link>
        </div>

        <input type="text" placeholder="Search for Counter-Strike 2 items" className="search-bar" />

        <div className="right">
          {isLoggedIn ? (
            <>
              <NotificationDropdown />
              <Link to="/dashboard" className="nav-btn dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="nav-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn">Log In</Link>
              <Link to="/register" className="nav-btn primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      <div className="categorybar">
        {categories.map((cat) => (
          <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="cat-link">
            {cat}
          </Link>
        ))}
        <MoreDropdown />
      </div>
    </>
  );
}
