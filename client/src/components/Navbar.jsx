import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';

const categories = [
  'Knife', 'Gloves', 'Pistol', 'Rifle', 'SMG', 'Heavy', 'Agent', 'Charm', 'Sticker', 'Container', 'Key', 'Patch', 'Graffiti', 'Collectible', 'Pass', 'Music Kit'
];

const moreCategories = [];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("authToken");
      const isLoggedInStorage = localStorage.getItem("isLoggedIn") === "true";
      const userStr = localStorage.getItem("user");
      
      if (token && userStr) {
        try {
          JSON.parse(userStr); // Just validate the JSON is parseable
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsLoggedIn(isLoggedInStorage);
        }
      } else {
        setIsLoggedIn(isLoggedInStorage);
      }
    };

    // Check auth state on mount
    checkAuthState();

    // Listen for storage changes (when user logs in from another tab or component)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user' || e.key === 'isLoggedIn') {
        checkAuthState();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

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
              <Link to="/my-inventory" className="nav-btn inventory-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                My Inventory
              </Link>
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Link to="/auth" className="nav-btn">Log In</Link>
              <Link to="/auth" className="nav-btn primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      <div className="categorybar">
        <Link to="/marketplace" className="cat-link featured">
          🛒 Marketplace
        </Link>
        {categories.map((cat) => (
          <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="cat-link">
            {cat}
          </Link>
        ))}
        {moreCategories.map((cat) => (
          <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="cat-link">
            {cat}
          </Link>
        ))}
      </div>
    </>
  );
}
