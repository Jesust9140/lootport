import React, { useState } from 'react';

const MoreDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="HeaderMenu-more">
      <div role="presentation" className="HeaderMenu-moreBtn" onClick={toggleDropdown}>
        More
      </div>
      {isOpen && (
        <div className="HeaderMenu-moreDropDown">
          {['Knife', 'Gloves', 'Pistol', 'Rifle', 'SMG', 'Heavy', 'Agent', 'Charm', 'Sticker', 'Container', 'Key', 'Patch', 'Graffiti', 'Collectible', 'Pass', 'Music Kit'].map((item) => (
            <div key={item} role="presentation" className="HeaderMenu-item HeaderMenu-item--dropdown">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoreDropdown;
