import React from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css';

export default function CategoryPage() {
  const { category } = useParams();
  
  // Capitalize first letter of category
  const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1);

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{categoryName} Skins</h1>
        <p>Browse all {categoryName} skins in our marketplace</p>
      </div>
      
      <div className="category-filters">
        <div className="filter-group">
          <label>Wear:</label>
          <select>
            <option value="">All Conditions</option>
            <option value="factory-new">Factory New</option>
            <option value="minimal-wear">Minimal Wear</option>
            <option value="field-tested">Field-Tested</option>
            <option value="well-worn">Well-Worn</option>
            <option value="battle-scarred">Battle-Scarred</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Price Range:</label>
          <div className="price-range">
            <input type="number" placeholder="Min" />
            <span>-</span>
            <input type="number" placeholder="Max" />
          </div>
        </div>
        
        <div className="filter-group">
          <label>Sort by:</label>
          <select>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>
      
      <div className="category-content">
        <div className="skins-grid">
          {/* Placeholder for skins - you can integrate with your existing SkinList component */}
          <div className="skin-placeholder">
            <div className="skin-image-placeholder"></div>
            <h3>Coming Soon</h3>
            <p>{categoryName} skins will be available here</p>
            <div className="price">$0.00</div>
          </div>
          
          <div className="skin-placeholder">
            <div className="skin-image-placeholder"></div>
            <h3>Coming Soon</h3>
            <p>{categoryName} skins will be available here</p>
            <div className="price">$0.00</div>
          </div>
          
          <div className="skin-placeholder">
            <div className="skin-image-placeholder"></div>
            <h3>Coming Soon</h3>
            <p>{categoryName} skins will be available here</p>
            <div className="price">$0.00</div>
          </div>
          
          <div className="skin-placeholder">
            <div className="skin-image-placeholder"></div>
            <h3>Coming Soon</h3>
            <p>{categoryName} skins will be available here</p>
            <div className="price">$0.00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
