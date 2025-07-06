import React from 'react';
import { 
  getMarketplaceItems, 
  createTransaction,
  formatPrice,
  formatRarity,
  formatWear
} from '../api/inventoryAPI';
import { useFilters, useAsyncOperation, useSelection } from '../hooks/useFilters';
import { handleApiError, showSuccessMessage } from '../utils/apiUtils';
import './Marketplace.css';

const Marketplace = () => {
  const {
    filters,
    setFilter,
    resetFilters
  } = useFilters({
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

  const {
    data: marketplaceData,
    loading,
    error,
    execute: loadMarketplace,
    clearError
  } = useAsyncOperation(
    () => getMarketplaceItems(filters),
    [filters]
  );

  const {
    selectedItems: purchasing,
    selectItem: setPurchasing,
    clearSelection: clearPurchasing
  } = useSelection();

  const items = marketplaceData?.items || [];
  const pagination = marketplaceData?.pagination || {};

  const handlePurchase = async (itemId) => {
    try {
      setPurchasing(itemId);
      const response = await createTransaction(itemId);
      
      showSuccessMessage(`Purchase initiated! Transaction ID: ${response.transaction.transactionId}`);
      
      // Refresh marketplace to update item availability
      loadMarketplace();
    } catch (err) {
      handleApiError(err, 'Failed to process purchase');
    } finally {
      clearPurchasing();
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
          <button onClick={clearError} className="btn btn-icon">×</button>
        </div>
      )}

      {/* Filters */}
      <div className="marketplace-filters">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search skins..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="form-input"
          />
          
          <select
            value={filters.rarity}
            onChange={(e) => setFilter('rarity', e.target.value)}
            className="form-select"
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
            onChange={(e) => setFilter('wear', e.target.value)}
            className="form-select"
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
            onChange={(e) => setFilter('minPrice', e.target.value)}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilter('maxPrice', e.target.value)}
            className="form-input"
          />
          
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            className="form-select"
          >
            <option value="listedAt">Recently Listed</option>
            <option value="listingPrice">Price</option>
            <option value="steamMarketPrice">Market Price</option>
            <option value="itemName">Name</option>
            <option value="rarity">Rarity</option>
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) => setFilter('sortOrder', e.target.value)}
            className="form-select"
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
              purchasing={purchasing.includes(item._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="pagination">
          <button
            onClick={() => setFilter('page', pagination.current - 1)}
            disabled={pagination.current === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {pagination.current} of {pagination.total}
          </span>
          
          <button
            onClick={() => setFilter('page', pagination.current + 1)}
            disabled={pagination.current === pagination.total}
            className="btn btn-secondary"
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
          className={`btn btn-primary ${purchasing ? 'loading' : ''}`}
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
            className="btn btn-outline"
          >
            Inspect in Game
          </a>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
