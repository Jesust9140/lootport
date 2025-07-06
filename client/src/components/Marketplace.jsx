import React, { useState, useEffect } from 'react';
import { 
  getMarketplaceItems, 
  createTransaction,
  formatPrice,
  formatRarity,
  formatWear
} from '../api/inventoryAPI';
import './Marketplace.css';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // Filter states
  const [filters, setFilters] = useState({
    rarity: '',
    wear: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'listedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    loadMarketplace();
  }, [filters]);

  const loadMarketplace = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getMarketplaceItems(filters);
      
      setItems(response.items || []);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.message);
      console.error('Error loading marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePurchase = async (itemId) => {
    try {
      setPurchasing(itemId);
      setError(null);
      
      const response = await createTransaction(itemId);
      
      // Show success message
      alert(`Purchase initiated! Transaction ID: ${response.transaction.transactionId}`);
      
      // Refresh marketplace to update item availability
      loadMarketplace();
    } catch (err) {
      setError(err.message);
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="marketplace">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h2>Marketplace</h2>
        <p>Discover and purchase CS2 skins from the community</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Filters */}
      <div className="marketplace-filters">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search skins..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          
          <select
            value={filters.rarity}
            onChange={(e) => handleFilterChange('rarity', e.target.value)}
            className="filter-select"
          >
            <option value="">All Rarities</option>
            <option value="Consumer Grade">Consumer Grade</option>
            <option value="Industrial Grade">Industrial Grade</option>
            <option value="Mil-Spec">Mil-Spec</option>
            <option value="Restricted">Restricted</option>
            <option value="Classified">Classified</option>
            <option value="Covert">Covert</option>
            <option value="Contraband">Contraband</option>
          </select>

          <select
            value={filters.wear}
            onChange={(e) => handleFilterChange('wear', e.target.value)}
            className="filter-select"
          >
            <option value="">All Conditions</option>
            <option value="Factory New">Factory New</option>
            <option value="Minimal Wear">Minimal Wear</option>
            <option value="Field-Tested">Field-Tested</option>
            <option value="Well-Worn">Well-Worn</option>
            <option value="Battle-Scarred">Battle-Scarred</option>
          </select>
        </div>

        <div className="filter-row">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="price-input"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="price-input"
          />
          
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            <option value="listedAt">Recently Listed</option>
            <option value="listingPrice">Price</option>
            <option value="steamMarketPrice">Market Price</option>
            <option value="itemName">Name</option>
            <option value="rarity">Rarity</option>
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="filter-select"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="no-items">
          <h3>No items found</h3>
          <p>Try adjusting your filters or check back later for new listings</p>
        </div>
      ) : (
        <div className="marketplace-grid">
          {items.map((item) => (
            <MarketplaceItem
              key={item._id}
              item={item}
              onPurchase={() => handlePurchase(item._id)}
              purchasing={purchasing === item._id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="pagination">
          <button
            onClick={() => handleFilterChange('page', pagination.current - 1)}
            disabled={pagination.current === 1}
            className="page-btn"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {pagination.current} of {pagination.total}
          </span>
          
          <button
            onClick={() => handleFilterChange('page', pagination.current + 1)}
            disabled={pagination.current === pagination.total}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Individual marketplace item component
const MarketplaceItem = ({ item, onPurchase, purchasing }) => {
  const rarity = formatRarity(item.rarity);
  const wear = formatWear(item.wear);
  
  // Calculate savings vs market price
  const savings = item.steamMarketPrice - item.listingPrice;
  const savingsPercent = item.steamMarketPrice > 0 
    ? ((savings / item.steamMarketPrice) * 100).toFixed(1)
    : 0;

  const formatTimeAgo = (date) => {
    const now = new Date();
    const listedDate = new Date(date);
    const diffInMinutes = Math.floor((now - listedDate) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="marketplace-item">
      <div className="item-image">
        <img src={item.imageUrl} alt={`${item.itemName} | ${item.skinName}`} />
        <div 
          className="rarity-border" 
          style={{ borderColor: rarity.color }}
        ></div>
        
        {savings > 0 && (
          <div className="savings-badge">
            -{savingsPercent}%
          </div>
        )}
      </div>
      
      <div className="item-details">
        <h3 className="item-name">{item.itemName} | {item.skinName}</h3>
        
        <div className="item-meta">
          <span className="wear">{wear}</span>
          <span 
            className="rarity" 
            style={{ color: rarity.color }}
          >
            {rarity.name}
          </span>
        </div>
        
        {item.floatValue && (
          <div className="float-value">
            Float: {item.floatValue.toFixed(6)}
          </div>
        )}
        
        <div className="pricing-info">
          <div className="listing-price">
            <span className="price">{formatPrice(item.listingPrice)}</span>
            <span className="label">Your Price</span>
          </div>
          
          {item.steamMarketPrice > 0 && (
            <div className="market-price">
              <span className="price">{formatPrice(item.steamMarketPrice)}</span>
              <span className="label">Steam Market</span>
            </div>
          )}
        </div>
        
        <div className="seller-info">
          <span className="seller">Seller: {item.owner?.username || 'Anonymous'}</span>
          <span className="listed-time">{formatTimeAgo(item.listedAt)}</span>
        </div>
      </div>
      
      <div className="item-actions">
        <button 
          onClick={onPurchase}
          disabled={purchasing}
          className={`purchase-btn ${purchasing ? 'loading' : ''}`}
        >
          {purchasing ? (
            <>
              <div className="mini-spinner"></div>
              Processing...
            </>
          ) : (
            <>
              Buy Now
              <span className="price-tag">{formatPrice(item.listingPrice)}</span>
            </>
          )}
        </button>
        
        {item.inspectLink && (
          <a 
            href={item.inspectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inspect-btn"
          >
            Inspect in Game
          </a>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
