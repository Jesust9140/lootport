// TODO: should use axios instead of fetch for better error handling and interceptors
// also need to implement request caching to reduce API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getUserInventory = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch inventory");
    }

    // should add pagination support here for large inventories
    return data;
  } catch (error) {
    console.error("Inventory fetch error:", error);
    throw error;
  }
};

// this function is mostly for testing, real inventory comes from Steam
export const addInventoryItem = async (itemData) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add item to inventory");
    }

    return data;
  } catch (error) {
    console.error("Add inventory item error:", error);
    throw error;
  }
};

// List item for sale
export const listItemForSale = async (itemId, listingPrice) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory/${itemId}/list`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ listingPrice }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to list item for sale");
    }

    return data;
  } catch (error) {
    console.error("List item error:", error);
    throw error;
  }
};

// Update listing price
export const updateListingPrice = async (itemId, listingPrice) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ listingPrice }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update listing price");
    }

    return data;
  } catch (error) {
    console.error("Update listing error:", error);
    throw error;
  }
};

// Unlist item
export const unlistItem = async (itemId) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory/${itemId}/unlist`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to unlist item");
    }

    return data;
  } catch (error) {
    console.error("Unlist item error:", error);
    throw error;
  }
};

// Get marketplace items
export const getMarketplaceItems = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/inventory/marketplace?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch marketplace items");
    }

    return data;
  } catch (error) {
    console.error("Marketplace fetch error:", error);
    throw error;
  }
};

// Mark item as sold (admin only)
export const markItemSold = async (itemId, soldPrice) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory/${itemId}/sold`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ soldPrice }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to mark item as sold");
    }

    return data;
  } catch (error) {
    console.error("Mark sold error:", error);
    throw error;
  }
};

// ==================== TRANSACTION API ====================

// Create a transaction (buy item)
export const createTransaction = async (inventoryItemId, buyerId = null) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ inventoryItemId, buyerId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create transaction");
    }

    return data;
  } catch (error) {
    console.error("Create transaction error:", error);
    throw error;
  }
};

// Get user's transaction history
export const getUserTransactions = async (params = {}) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/transactions?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch transactions");
    }

    return data;
  } catch (error) {
    console.error("Transaction fetch error:", error);
    throw error;
  }
};

// Complete a transaction
export const completeTransaction = async (transactionId) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to complete transaction");
    }

    return data;
  } catch (error) {
    console.error("Complete transaction error:", error);
    throw error;
  }
};

// Cancel a transaction
export const cancelTransaction = async (transactionId, reason = '') => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to cancel transaction");
    }

    return data;
  } catch (error) {
    console.error("Cancel transaction error:", error);
    throw error;
  }
};

// ==================== ADVANCED INVENTORY API ====================

// Get advanced inventory with filtering
export const getAdvancedInventory = async (params = {}) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/inventory/advanced?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch advanced inventory");
    }

    return data;
  } catch (error) {
    console.error("Advanced inventory fetch error:", error);
    throw error;
  }
};

// Get inventory analytics
export const getInventoryAnalytics = async (period = '30d') => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory/analytics?period=${period}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch inventory analytics");
    }

    return data;
  } catch (error) {
    console.error("Inventory analytics fetch error:", error);
    throw error;
  }
};

// Bulk update inventory items
export const bulkUpdateInventory = async (itemIds, action, data = {}) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/inventory/bulk`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ itemIds, action, data }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to bulk update inventory");
    }

    return responseData;
  } catch (error) {
    console.error("Bulk update error:", error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
};

export const formatRarity = (rarity) => {
  const rarityColors = {
    'Consumer Grade': '#b0c3d9',
    'Industrial Grade': '#5e98d9',
    'Mil-Spec': '#4b69ff',
    'Restricted': '#8847ff',
    'Classified': '#d32ce6',
    'Covert': '#eb4b4b',
    'Contraband': '#e4ae39'
  };
  
  return {
    name: rarity,
    color: rarityColors[rarity] || '#ffffff'
  };
};

export const formatWear = (wear) => {
  const wearAbbreviations = {
    'Factory New': 'FN',
    'Minimal Wear': 'MW',
    'Field-Tested': 'FT',
    'Well-Worn': 'WW',
    'Battle-Scarred': 'BS'
  };
  
  return wearAbbreviations[wear] || wear;
};
