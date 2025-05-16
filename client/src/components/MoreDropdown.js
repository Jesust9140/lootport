import React, { useState } from 'react';
import './MoreDropdown.css';

export default function MoreDropdown() {
  const [open, setOpen] = useState(false);
  const items = [
    'Knife', 'Gloves', 'Pistol', 'Rifle', 'SMG',
    'Heavy', 'Agent', 'Charm', 'Sticker', 'Container',
    'Key', 'Patch', 'Graffiti', 'Collectible', 'Pass', 'Music Kit',
  ];

  return (
    <div className="HeaderMenu-more">
      <div
        role="presentation"
        className="HeaderMenu-moreBtn"
        onClick={() => setOpen(!open)}
      >
        More
      </div>

      {open && (
        <div className="HeaderMenu-moreDropDown">
          {items.map((item, index) => (
            <div
              key={index}
              role="presentation"
              className="HeaderMenu-item HeaderMenu-item--dropdown"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
