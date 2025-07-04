// Steam API functions for frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Connect Steam account
export const connectSteamAccount = async (steamData) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/steam/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(steamData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to connect Steam account");
    }

    return data;
  } catch (error) {
    console.error("Connect Steam error:", error);
    throw error;
  }
};

// Get Steam profile
export const getSteamProfile = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/steam/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch Steam profile");
    }

    return data;
  } catch (error) {
    console.error("Steam profile fetch error:", error);
    throw error;
  }
};

// Generate verification code
export const generateVerificationCode = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/steam/verify/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to generate verification code");
    }

    return data;
  } catch (error) {
    console.error("Generate verification error:", error);
    throw error;
  }
};

// Verify Steam account
export const verifySteamAccount = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/steam/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify Steam account");
    }

    return data;
  } catch (error) {
    console.error("Verify Steam error:", error);
    throw error;
  }
};

// Import Steam inventory
export const importSteamInventory = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/steam/import-inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to import Steam inventory");
    }

    return data;
  } catch (error) {
    console.error("Import inventory error:", error);
    throw error;
  }
};

// Set trade URL
export const setTradeUrl = async (tradeUrl) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/steam/trade-url`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ tradeUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to set trade URL");
    }

    return data;
  } catch (error) {
    console.error("Set trade URL error:", error);
    throw error;
  }
};
