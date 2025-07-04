import User from "../models/User.js";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('notifications');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Sort notifications by creation date (newest first)
    const sortedNotifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      notifications: sortedNotifications,
      unreadCount: user.notifications.filter(n => !n.read).length
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching notifications",
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notification = user.notifications.id(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.read = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating notification",
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.notifications.forEach(notification => {
      notification.read = true;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating notifications",
    });
  }
};

// @desc    Send notification to all customers (admin only)
// @route   POST /api/notifications/broadcast
// @access  Private (Admin only)
export const broadcastNotification = async (req, res) => {
  try {
    const { title, message, type = 'website_update' } = req.body;

    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Get all customer users
    const customers = await User.find({ role: 'customer' });

    // Add notification to all customers
    const updatePromises = customers.map(customer => 
      customer.addNotification(title, message, type)
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: `Notification sent to ${customers.length} customers`,
      notificationsSent: customers.length
    });
  } catch (error) {
    console.error("Broadcast notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error sending notification",
    });
  }
};

// @desc    Send skin sold notification to specific user
// @route   POST /api/notifications/skin-sold
// @access  Private (Admin only)
export const notifySkinSold = async (req, res) => {
  try {
    const { userId, skinName, salePrice } = req.body;

    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const customer = await User.findById(userId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customer.addNotification(
      "🎉 Your Skin Sold!",
      `Congratulations! Your ${skinName} has been sold for $${salePrice}. The payment will be processed shortly.`,
      "skin_sold"
    );

    res.status(200).json({
      success: true,
      message: "Skin sold notification sent",
    });
  } catch (error) {
    console.error("Skin sold notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error sending skin sold notification",
    });
  }
};
