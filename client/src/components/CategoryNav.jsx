import React from "react";
import "../style.css";
import logo from "../concept2.png";

const categories = {
  Rifles: ["AK-47", "M4A1-S", "FAMAS"],
  Pistols: ["Glock-18", "USP-S", "Deagle"],
  SMGs: ["MP7", "MAC-10", "P90"],
  Heavy: ["Nova", "XM1014", "Negev"],
  Knives: ["Karambit", "Butterfly", "Bayonet"]
,Gloves: ["Sport", "Driver", "Hand Wraps"],
  Agents: ["CT Agent", "T Agent"],
  Containers: ["Cases", "Souvenirs"],
  Stickers: ["Holo", "Foil", "Paper"],
  Charms: ["Keychains", "Mini Medals"],
  Patches: ["Team Patch", "Event Patch"],
  Collectibles: ["Pins", "Coins"],
  "Music Kits": ["EZ4ENCE", "AWOLNATION"],
};

export default function CategoryNav() {
  return (
    <div className="navigation">
      {/* Top Section */}
      <div className="top-nav">
        <div className="nav-left">
          <a href="/">
            <img src={logo} alt="Lootdrop Logo" className="logo-image" />
          </a>
        </div>

        <div className="nav-search">
          <input
            type="text"
            placeholder="Search for items..."
            className="search-input"
          />
        </div>

        <div className="nav-right">
          <a href="/login" className="auth-link">
            Log In
          </a>
          <a href="/register" className="auth-link">
            Sign Up
          </a>
        </div>
      </div>

      {/* Category Bar */}
      <div className="category-bar">
        {Object.keys(categories).map((category) => (
          <button key={category} className="category-button">
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
