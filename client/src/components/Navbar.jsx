// import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../concept2.png';
import MoreDropdown from './MoreDropdown';

const categories = [
  'Knife', 'Gloves', 'Pistol', 'Rifle', 'SMG', 'Heavy',
  'Agent', 'Charm', 'Sticker', 'Container', 'Key', 'Patch',
  'Graffiti', 'Collectible', 'Pass', 'Music Kit',
];

export default function Navbar() {
  return (
    <>
      <div className="topbar">
        <div className="left">
          <Link to="/" className="brand-link">
            <img src={logo} alt="Lootdrop Logo" className="logo" />
            <span className="brand">Lootdrop</span>
          </Link>
        </div>

        <input type="text" placeholder="Search for Counter-Strike 2 items" className="search-bar" />

        <div className="right">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/register" className="nav-btn primary">Create Account</Link>
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
