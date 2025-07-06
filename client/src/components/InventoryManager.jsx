import React, { useState, useEffect } from 'react';
import { 
  getUserInventory, 
  getAdvancedInventory, 
  listItemForSale, 
  unlistItem, 
  bulkUpdateInventory,
  formatPrice,
  formatRarity,
  formatWear
} from '../api/inventoryAPI';
import './InventoryManager.css';

// Helper function for status colors
const getStatusColor = (status) => {
  const colors = {
    'in_inventory': '#64748b',
    'listed': '#22c55e',
    'sold': '#ef4444',
    'pending_trade': '#f59e0b'
  };
  return colors[status] || '#64748b';
};

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});
  
  // Filter states
  const [filters, setFilters] = useState({
    rarity: '',
    wear: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });

  // UI states
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkListingPrice, setBulkListingPrice] = useState('');

  useEffect(() => {
    loadInventory();
  }, [filters]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAdvancedInventory(filters);
      
      setInventory(response.inventory);
      setFilteredInventory(response.inventory);
      setStats(response.stats);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
      console.error('Error loading inventory:', err);
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

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item._id));
    }
  };

  const handleListItem = async (itemId, price) => {
    try {
      await listItemForSale(itemId, parseFloat(price));
      loadInventory(); // Refresh inventory
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnlistItem = async (itemId) => {
    try {
      await unlistItem(itemId);
      loadInventory(); // Refresh inventory
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) return;

    try {
      let data = {};
      if (action === 'list' || action === 'update_price') {
        if (!bulkListingPrice) {
          setError('Please enter a listing price for bulk operations');
          return;
        }
        data.listingPrice = parseFloat(bulkListingPrice);
      }

      await bulkUpdateInventory(selectedItems, action, data);
      setSelectedItems([]);
      setBulkListingPrice('');
      setShowBulkActions(false);
      loadInventory(); // Refresh inventory
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="inventory-manager">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-manager">
      <div className="inventory-header">
        <h2>My Inventory</h2>
        <div className="inventory-stats">
          <div className="stat-card">
            <h3>{stats.total || 0}</h3>
            <p>Total Items</p>
          </div>
          <div className="stat-card">
            <h3>{stats.byStatus?.listed || 0}</h3>
            <p>Listed</p>
          </div>
          <div className="stat-card">
            <h3>{formatPrice(stats.totalValue || 0)}</h3>
            <p>Total Value</p>
          </div>
          <div className="stat-card">
            <h3>{formatPrice(stats.listedValue || 0)}</h3>
            <p>Listed Value</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Filters */}
      <div className="inventory-filters">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search items..."
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

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="in_inventory">In Inventory</option>
            <option value="listed">Listed</option>
            <option value="sold">Sold</option>
            <option value="pending_trade">Pending Trade</option>
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
            <option value="createdAt">Date Added</option>
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

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-header">
            <span>{selectedItems.length} items selected</span>
            <button 
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="toggle-bulk-btn"
            >
              {showBulkActions ? 'Hide' : 'Show'} Actions
            </button>
          </div>
          
          {showBulkActions && (
            <div className="bulk-controls">
              <input
                type="number"
                placeholder="Listing price..."
                value={bulkListingPrice}
                onChange={(e) => setBulkListingPrice(e.target.value)}
                className="bulk-price-input"
              />
              <button onClick={() => handleBulkAction('list')} className="bulk-btn list">
                List All
              </button>
              <button onClick={() => handleBulkAction('unlist')} className="bulk-btn unlist">
                Unlist All
              </button>
              <button onClick={() => handleBulkAction('update_price')} className="bulk-btn update">
                Update Prices
              </button>
            </div>
          )}
        </div>
      )}

      {/* Inventory Grid */}
      <div className="inventory-controls">
        <button onClick={handleSelectAll} className="select-all-btn">
          {selectedItems.length === filteredInventory.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="inventory-grid">
        {filteredInventory.map((item) => (
          <InventoryItem
            key={item._id}
            item={item}
            selected={selectedItems.includes(item._id)}
            onSelect={() => handleItemSelect(item._id)}
            onList={handleListItem}
            onUnlist={handleUnlistItem}
          />
        ))}
      </div>

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

// Individual inventory item component
const InventoryItem = ({ item, selected, onSelect, onList, onUnlist }) => {
  const [showActions, setShowActions] = useState(false);
  const [listingPrice, setListingPrice] = useState(item.listingPrice || '');
  
  const rarity = formatRarity(item.rarity);
  const wear = formatWear(item.wear);

  const handleListSubmit = (e) => {
    e.preventDefault();
    if (listingPrice && parseFloat(listingPrice) > 0) {
      onList(item._id, listingPrice);
      setShowActions(false);
    }
  };

  return (
    <div className={`inventory-item ${selected ? 'selected' : ''}`}>
      <div className="item-checkbox">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
        />
      </div>
      
      <div className="item-image">
        <img src={item.imageUrl} alt={`${item.itemName} | ${item.skinName}`} />
        <div 
          className="rarity-border" 
          style={{ borderColor: rarity.color }}
        ></div>
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
        
        <div className="item-pricing">
          {item.listingPrice && (
            <span className="listing-price">
              Listed: {formatPrice(item.listingPrice)}
            </span>
          )}
          <span className="market-price">
            Market: {formatPrice(item.steamMarketPrice || 0)}
          </span>
        </div>
        
        <div className="item-status">
          <span 
            className={`status-badge ${item.status}`}
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            {item.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="item-actions">
        {item.status === 'in_inventory' && (
          <button 
            onClick={() => setShowActions(!showActions)}
            className="action-btn list"
          >
            List for Sale
          </button>
        )}
        
        {item.status === 'listed' && (
          <button 
            onClick={() => onUnlist(item._id)}
            className="action-btn unlist"
          >
            Unlist
          </button>
        )}
        
        {showActions && item.status === 'in_inventory' && (
          <form onSubmit={handleListSubmit} className="listing-form">
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Price..."
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              className="price-input"
            />
            <button type="submit" className="submit-btn">List</button>
            <button 
              type="button" 
              onClick={() => setShowActions(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InventoryManager;
