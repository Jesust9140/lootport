import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import InventoryItem from "../models/InventoryItem.js";

// @desc    Get user profile with complete information
// @route   GET /api/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's inventory
    const inventory = await InventoryItem.find({ userId: req.user.userId });

    // Get transaction history
    const transactions = await Transaction.find({ userId: req.user.userId })
      .sort({ transactionDate: -1 })
      .limit(50);

    // Calculate stats
    const totalPurchases = transactions.filter(t => t.type === 'buy').length;
    const totalSales = transactions.filter(t => t.type === 'sell').length;
    const totalSpent = transactions
      .filter(t => t.type === 'buy')
      .reduce((sum, t) => sum + t.price, 0);
    const totalEarned = transactions
      .filter(t => t.type === 'sell')
      .reduce((sum, t) => sum + t.price, 0);
    const inventoryValue = inventory.reduce((sum, item) => sum + item.price, 0);

    res.status(200).json({
      success: true,
      profile: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          profilePicture: user.profilePicture,
          steamId: user.steamId,
          steamProfileUrl: user.steamProfileUrl,
          bio: user.bio,
          location: user.location,
          role: user.role,
          joinDate: user.joinDate,
        },
        stats: {
          totalPurchases,
          totalSales,
          totalSpent,
          totalEarned,
          inventoryValue,
          itemsOwned: inventory.length,
          netProfit: totalEarned - totalSpent
        },
        inventory,
        recentTransactions: transactions.slice(0, 10)
      }
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching profile",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { username, bio, location, profilePicture } = req.body;

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio,
        location: user.location,
        role: user.role,
        joinDate: user.joinDate,
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating profile",
    });
  }
};

// @desc    Get user's transaction history
// @route   GET /api/profile/transactions
// @access  Private
export const getUserTransactions = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    
    const filter = { userId: req.user.userId };
    if (type && ['buy', 'sell'].includes(type)) {
      filter.type = type;
    }

    const transactions = await Transaction.find(filter)
      .sort({ transactionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Transaction history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching transaction history",
    });
  }
};

// @desc    Link Steam account
// @route   POST /api/profile/steam/link
// @access  Private
export const linkSteamAccount = async (req, res) => {
  try {
    const { steamId, steamProfileUrl } = req.body;

    if (!steamId) {
      return res.status(400).json({
        success: false,
        message: "Steam ID is required",
      });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if Steam ID is already linked to another user
    const existingSteamUser = await User.findOne({ 
      steamId,
      _id: { $ne: req.user.userId }
    });

    if (existingSteamUser) {
      return res.status(400).json({
        success: false,
        message: "This Steam account is already linked to another user",
      });
    }

    user.steamId = steamId;
    user.steamProfileUrl = steamProfileUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Steam account linked successfully",
      steamData: {
        steamId: user.steamId,
        steamProfileUrl: user.steamProfileUrl
      }
    });
  } catch (error) {
    console.error("Steam link error:", error);
    res.status(500).json({
      success: false,
      message: "Server error linking Steam account",
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/profile/picture
// @access  Private
export const uploadProfilePicture = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.profilePicture = imageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error uploading profile picture",
    });
  }
};

// @desc    Change user password
// @route   PUT /api/profile/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      success: false,
      message: "Server error changing password",
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/profile/delete-account
// @access  Private
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user's inventory items
    await InventoryItem.deleteMany({ userId: req.user.userId });

    // Delete user's transactions
    await Transaction.deleteMany({ userId: req.user.userId });

    // Delete user account
    await User.findByIdAndDelete(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting account",
    });
  }
};
