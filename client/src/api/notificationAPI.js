// Notification API functions for frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get user notifications
export const getUserNotifications = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch notifications");
    }

    return data;
  } catch (error) {
    console.error("Notifications fetch error:", error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to mark notification as read");
    }

    return data;
  } catch (error) {
    console.error("Mark notification as read error:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to mark all notifications as read");
    }

    return data;
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete notification");
    }

    return data;
  } catch (error) {
    console.error("Delete notification error:", error);
    throw error;
  }
};

// Create notification (for admin/system use)
export const createNotification = async (notificationData) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create notification");
    }

    return data;
  } catch (error) {
    console.error("Create notification error:", error);
    throw error;
  }
};

// Get notification count
export const getNotificationCount = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      return { unread: 0, total: 0 };
    }

    const response = await fetch(`${API_BASE_URL}/notifications/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch notification count");
    }

    return data;
  } catch (error) {
    console.error("Notification count fetch error:", error);
    return { unread: 0, total: 0 };
  }
};

// Mock data for development (can be removed when backend is ready)
export const getMockNotifications = () => {
  return [
    {
      id: 1,
      type: "sale",
      title: "Item Sold!",
      message: "Your AK-47 Redline (Field-Tested) has been sold for $45.99",
      time: "5 minutes ago",
      read: false,
      icon: "💰",
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      type: "news",
      title: "New Website Feature",
      message: "Introducing price tracking! Now you can track your favorite skins.",
      time: "2 hours ago",
      read: false,
      icon: "🆕",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      type: "purchase",
      title: "Purchase Confirmed",
      message: "You successfully bought M4A4 Howl (Minimal Wear) for $1,299.99",
      time: "1 day ago",
      read: true,
      icon: "🛒",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};
