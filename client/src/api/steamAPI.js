// Steam API functions for frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Initiate Steam login
export const initiateSteamLogin = async () => {
  try {
    // Get Steam URL from backend
    const response = await fetch(`${API_BASE_URL}/auth/steam/url`);
    const data = await response.json();
    
    if (data.success && data.steamUrl) {
      // Redirect to Steam OpenID
      window.location.href = data.steamUrl;
    } else {
      throw new Error("Failed to get Steam login URL");
    }
  } catch (error) {
    console.error("Steam login error:", error);
    throw error;
  }
};

// Link Steam account to existing user
export const linkSteamAccount = async (steamId64) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/auth/steam/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ steamId64 }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to link Steam account");
    }

    return data;
  } catch (error) {
    console.error("Link Steam error:", error);
    throw error;
  }
};

// Register new account with Steam
export const registerWithSteam = async (steamId64, email, username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/steam/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ steamId64, email, username }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to register with Steam");
    }

    return data;
  } catch (error) {
    console.error("Register with Steam error:", error);
    throw error;
  }
};

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

// Steam Web API authentication (alternative to OpenID)
export const authenticateWithSteamId = async (steamId64) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/steam/webapi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ steamId64 }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Steam authentication failed");
    }

    return data;
  } catch (error) {
    console.error("Steam Web API authentication error:", error);
    throw error;
  }
};
