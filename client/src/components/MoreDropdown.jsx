import { useState } from 'react';
import { Link } from 'react-router-dom';
import './MoreDropdown.css';

const MoreDropdown = ({ categories = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="more-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="HeaderMenu-moreBtn">
        More
      </div>
      {isOpen && (
        <div className="HeaderMenu-moreDropDown">
          {categories.map((item) => (
            <Link 
              key={item} 
              to={`/category/${item.toLowerCase()}`}
              className="HeaderMenu-item HeaderMenu-item--dropdown"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoreDropdown;
