import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';

const categoryData = {
  'Knife': ['Kukri Knife', 'Butterfly Knife', 'Karambit', 'Huntsman Knife', 'Bayonet', 'Talon Knife', 'M9 Bayonet', 'Bowie Knife', 'Falchion Knife', 'Gut Knife', 'Stiletto Knife', 'Shadow Daggers'],
  'Gloves': ['Sport Gloves', 'Driver Gloves', 'Hand Wraps', 'Moto Gloves', 'Specialist Gloves', 'Bloodhound Gloves', 'Hydra Gloves', 'Broken Fang Gloves'],
  'Pistol': ['AK-47', 'M4A4', 'M4A1-S', 'AWP', 'Glock-18', 'USP-S', 'P250', 'Tec-9', 'Five-SeveN', 'CZ75-Auto', 'Desert Eagle', 'Dual Berettas', 'P2000', 'R8 Revolver'],
  'Rifle': ['AK-47', 'M4A4', 'M4A1-S', 'AWP', 'SSG 08', 'SCAR-20', 'G3SG1', 'AUG', 'SG 553', 'FAMAS', 'Galil AR'],
  'SMG': ['MP9', 'MAC-10', 'PP-Bizon', 'UMP-45', 'P90', 'MP5-SD', 'MP7'],
  'Heavy': ['Nova', 'XM1014', 'Sawed-Off', 'MAG-7', 'M249', 'Negev'],
  'Agent': ['FBI', 'GIGN', 'GSG-9', 'IDF', 'SASR', 'SAS', 'SEAL Team 6', 'SWAT'],
  'Charm': ['Weapon Charm', 'Keychain', 'Pendant'],
  'Sticker': ['Team Stickers', 'Signature Stickers', 'Tournament Stickers', 'Regular Stickers'],
  'Container': ['Cases', 'Capsules', 'Packages'],
  'Key': ['Case Keys', 'Capsule Keys'],
  'Patch': ['Team Patches', 'Operation Patches'],
  'Graffiti': ['Sealed Graffiti', 'Graffiti Patterns'],
  'Collectible': ['Pins', 'Coins', 'Trophies'],
  'Pass': ['Operation Pass', 'Tournament Pass'],
  'Music Kit': ['Electronic', 'Rock', 'Classical', 'Ambient']
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("authToken");
      const isLoggedInStorage = localStorage.getItem("isLoggedIn") === "true";
      const userStr = localStorage.getItem("user");
      
      if (token && userStr) {
        try {
          JSON.parse(userStr);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsLoggedIn(isLoggedInStorage);
        }
      } else {
        setIsLoggedIn(isLoggedInStorage);
      }
    };

    // I need to check auth state when component mounts
    checkAuthState();

    // Listen for auth changes from other components or tabs
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user' || e.key === 'isLoggedIn') {
        checkAuthState();
      }
    };

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
            <span className="brand">Lootdrop</span>
          </Link>
        </div>

        <input type="text" placeholder="Search for Counter-Strike 2 items" className="form-input search-bar" />

        <div className="right">
          {isLoggedIn ? (
            <>
              <ProfileDropdown />
              <NotificationDropdown />
              <Link to="/my-inventory" className="btn btn-secondary inventory-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                My Inventory
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn btn-secondary">Log In</Link>
              <Link to="/auth" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      <div className="categorybar">
        <Link to="/marketplace" className="cat-link featured">
          🛒 Marketplace
        </Link>
        {Object.entries(categoryData).map(([category, subcategories]) => (
          <div 
            key={category} 
            className="category-item"
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link to={`/category/${category.toLowerCase()}`} className="cat-link">
              {category}
            </Link>
            {hoveredCategory === category && (
              <div className="dropdown-menu">
                <Link to={`/category/${category.toLowerCase()}`} className="dropdown-item all-items">
                  All {category} Items
                </Link>
                <div className="dropdown-separator"></div>
                {subcategories.map((subcat) => (
                  <Link 
                    key={subcat} 
                    to={`/category/${category.toLowerCase()}/${subcat.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="dropdown-item"
                  >
                    {subcat}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

