// Profile API functions for frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch profile");
    }

    return data;
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    return data;
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
  }
};

// Get user transactions
export const getUserTransactions = async (type = null, page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    let url = `${API_BASE_URL}/profile/transactions?page=${page}&limit=${limit}`;
    if (type) {
      url += `&type=${type}`;
    }

    const response = await fetch(url, {
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
    console.error("Transactions fetch error:", error);
    throw error;
  }
};

// Link Steam account
export const linkSteamAccount = async (steamData) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/profile/steam/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(steamData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to link Steam account");
    }

    return data;
  } catch (error) {
    console.error("Steam link error:", error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (imageUrl) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/profile/picture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload profile picture");
    }

    return data;
  } catch (error) {
    console.error("Profile picture upload error:", error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to change password");
    }

    return data;
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
};

// Delete user account
export const deleteUserAccount = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/profile/delete-account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete account");
    }

    return data;
  } catch (error) {
    console.error("Account deletion error:", error);
    throw error;
  }
};

// Steam OAuth integration (placeholder for Steam Web API)
export const getSteamLoginUrl = () => {
  // In a real implementation, this would redirect to Steam's OAuth
  const steamOpenIdUrl = "https://steamcommunity.com/openid/login";
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': `${window.location.origin}/auth/steam/callback`,
    'openid.realm': window.location.origin,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
  });
  
  return `${steamOpenIdUrl}?${params.toString()}`;
};

// Mock Steam login for development
export const mockSteamLogin = async () => {
  try {
    // Simulate Steam login with mock data
    const mockSteamData = {
      steamId: '76561198' + Math.floor(Math.random() * 100000000),
      steamProfileUrl: 'https://steamcommunity.com/profiles/76561198' + Math.floor(Math.random() * 100000000),
    };

    return await linkSteamAccount(mockSteamData);
  } catch (error) {
    console.error("Mock Steam login error:", error);
    throw error;
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  getUserTransactions,
  linkSteamAccount,
  uploadProfilePicture,
  getSteamLoginUrl,
  mockSteamLogin,
  changePassword,
  deleteUserAccount
};
