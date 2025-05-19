import React from "react";
import "../style.css";

const categories = {
  Rifles: ["AK-47", "M4A1-S", "FAMAS"],
  Pistols: ["Glock-18", "USP-S", "Deagle"],
  SMGs: ["MP7", "MAC-10", "P90"],
  Heavy: ["Nova", "XM1014", "Negev"],
  Knives: ["Karambit", "Butterfly", "Bayonet"],
  Gloves: ["Sport", "Driver", "Hand Wraps"],
  Agents: ["CT Agent", "T Agent"],
  Containers: ["Cases", "Souvenirs"],
  Stickers: ["Holo", "Foil", "Paper"],
  Charms: ["Keychains", "Mini Medals"],
  Patches: ["Team Patch", "Event Patch"],
  Collectibles: ["Pins", "Coins"],
  "Music Kits": ["EZ4ENCE", "AWOLNATION"]
};

export default function CategoryNav() {
  return (
    <nav className="category-nav">
      {Object.entries(categories).map(([category, items]) => (
        <div key={category} className="category-item">
          <button className="category-button">
            {category} <span className="arrow-down">▼</span>
          </button>
          <div className="dropdown-menu">
            {items.map((item) => (
              <div key={item} className="dropdown-link">
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
