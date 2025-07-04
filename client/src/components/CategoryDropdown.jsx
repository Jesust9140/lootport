import { useState } from 'react';
import { Link } from 'react-router-dom';
import './CategoryDropdown.css';

// Sample items for each category
const categoryItems = {
  knife: [
    { name: 'Karambit', variants: ['Doppler', 'Fade', 'Tiger Tooth'] },
    { name: 'M9 Bayonet', variants: ['Doppler', 'Fade', 'Tiger Tooth'] },
    { name: 'Butterfly Knife', variants: ['Doppler', 'Fade'] }
  ],
  rifle: [
    { name: 'AK-47', variants: ['Redline', 'Asiimov', 'Vulcan'] },
    { name: 'M4A4', variants: ['Asiimov', 'Dragon King', 'Howl'] },
    { name: 'AWP', variants: ['Dragon Lore', 'Asiimov'] }
  ],
  pistol: [
    { name: 'Glock-18', variants: ['Fade', 'Water Elemental'] },
    { name: 'USP-S', variants: ['Kill Confirmed', 'Neo-Noir'] }
  ],
  gloves: [
    { name: 'Sport Gloves', variants: ['Pandora\'s Box', 'Vice'] },
    { name: 'Driver Gloves', variants: ['Racing Green'] }
  ],
  smg: [
    { name: 'MP7', variants: ['Nemesis', 'Bloodsport'] },
    { name: 'P90', variants: ['Asiimov'] }
  ],
  heavy: [
    { name: 'Nova', variants: ['Hyper Beast'] }
  ]
};

export default function CategoryDropdown({ category }) {
  const [isHovered, setIsHovered] = useState(false);
  const categoryKey = category.toLowerCase();
  const items = categoryItems[categoryKey] || [];

  return (
    <div 
      className="category-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/category/${categoryKey}`} 
        className="cat-link"
      >
        {category}
      </Link>

      {isHovered && items.length > 0 && (
        <div className="category-hover-menu">
          <div className="category-content">
            <h4 className="category-title">{category}</h4>
            <div className="category-grid">
              {items.slice(0, 4).map((item, index) => (
                <div key={index} className="category-card">
                  <Link 
                    to={`/category/${categoryKey}/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="item-name"
                  >
                    {item.name}
                  </Link>
                  <div className="item-variants">
                    {item.variants.slice(0, 2).map((variant, vIndex) => (
                      <Link
                        key={vIndex}
                        to={`/item/${categoryKey}/${item.name.toLowerCase().replace(/\s+/g, '-')}/${variant.toLowerCase().replace(/\s+/g, '-')}`}
                        className="variant"
                      >
                        {variant}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
