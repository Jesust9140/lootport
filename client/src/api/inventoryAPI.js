// Inventory API functions for frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get user's inventory
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

    return data;
  } catch (error) {
    console.error("Inventory fetch error:", error);
    throw error;
  }
};

// Add item to inventory
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
