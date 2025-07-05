import InventoryItem from "../models/InventoryItem.js";
import User from "../models/User.js";

// @desc    Get user's inventory
// @route   GET /api/inventory
// @access  Private
export const getUserInventory = async (req, res) => {
  try {
    const inventory = await InventoryItem.find({ owner: req.user.userId })
      .sort({ createdAt: -1 });

    const stats = {
      total: inventory.length,
      listed: inventory.filter(item => item.status === 'listed').length,
      sold: inventory.filter(item => item.status === 'sold').length,
      totalValue: inventory.reduce((sum, item) => sum + (item.listingPrice || item.steamMarketPrice || 0), 0)
    };

    res.status(200).json({
      success: true,
      inventory,
      stats
    });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching inventory",
    });
  }
};

// @desc    Add item to inventory manually (for testing)
// @route   POST /api/inventory
// @access  Private
export const addInventoryItem = async (req, res) => {
  try {
    const {
      steamId,
      itemName,
      skinName,
      rarity,
      wear,
      floatValue,
      imageUrl,
      steamMarketPrice,
      inspectLink,
      stickers,
      tags
    } = req.body;

    const inventoryItem = await InventoryItem.create({
      owner: req.user.userId,
      steamId,
      itemName,
      skinName,
      rarity,
      wear,
      floatValue,
      imageUrl,
      steamMarketPrice,
      inspectLink,
      stickers: stickers || [],
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      message: "Item added to inventory",
      item: inventoryItem
    });
  } catch (error) {
    console.error("Add inventory item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding item to inventory",
    });
  }
};

// @desc    List item for sale
// @route   PUT /api/inventory/:id/list
// @access  Private
export const listItemForSale = async (req, res) => {
  try {
    const { listingPrice } = req.body;
    const itemId = req.params.id;

    const item = await InventoryItem.findOne({
      _id: itemId,
      owner: req.user.userId
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in your inventory"
      });
    }

    if (item.status === 'listed') {
      return res.status(400).json({
        success: false,
        message: "Item is already listed for sale"
      });
    }

    item.listingPrice = listingPrice;
    item.status = 'listed';
    item.listedAt = new Date();
    await item.save();

    res.status(200).json({
      success: true,
      message: "Item listed for sale",
      item
    });
  } catch (error) {
    console.error("List item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error listing item",
    });
  }
};

// @desc    Update listing price
// @route   PUT /api/inventory/:id
// @access  Private
export const updateListingPrice = async (req, res) => {
  try {
    const { listingPrice } = req.body;
    const itemId = req.params.id;

    const item = await InventoryItem.findOne({
      _id: itemId,
      owner: req.user.userId,
      status: 'listed'
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Listed item not found"
      });
    }

    item.listingPrice = listingPrice;
    await item.save();

    res.status(200).json({
      success: true,
      message: "Listing price updated",
      item
    });
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating listing",
    });
  }
};

// @desc    Remove item from sale (unlist)
// @route   DELETE /api/inventory/:id/unlist
// @access  Private
export const unlistItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await InventoryItem.findOne({
      _id: itemId,
      owner: req.user.userId,
      status: 'listed'
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Listed item not found"
      });
    }

    item.status = 'in_inventory';
    item.listingPrice = null;
    item.listedAt = null;
    await item.save();

    res.status(200).json({
      success: true,
      message: "Item removed from sale",
      item
    });
  } catch (error) {
    console.error("Unlist item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error unlisting item",
    });
  }
};

// @desc    Mark item as sold (admin only)
// @route   PUT /api/inventory/:id/sold
// @access  Private (Admin only)
export const markItemSold = async (req, res) => {
  try {
    const { soldPrice, buyerId } = req.body;
    const itemId = req.params.id;

    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const item = await InventoryItem.findOne({
      _id: itemId,
      status: 'listed'
    }).populate('owner');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Listed item not found"
      });
    }

    item.status = 'sold';
    item.soldPrice = soldPrice;
    item.soldAt = new Date();
    if (buyerId) {
      item.buyerId = buyerId;
    }
    await item.save();

    // Send notification to seller
    await item.owner.addNotification(
      "🎉 Your Skin Sold!",
      `Congratulations! Your ${item.itemName} | ${item.skinName} has been sold for $${soldPrice}. The payment will be processed shortly.`,
      "skin_sold"
    );

    res.status(200).json({
      success: true,
      message: "Item marked as sold and notification sent",
      item
    });
  } catch (error) {
    console.error("Mark sold error:", error);
    res.status(500).json({
      success: false,
      message: "Server error marking item as sold",
    });
  }
};

// @desc    Get all listed items (marketplace)
// @route   GET /api/inventory/marketplace
// @access  Public
export const getMarketplace = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      rarity, 
      wear, 
      minPrice, 
      maxPrice, 
      search 
    } = req.query;

    const query = { status: 'listed' };
    
    // Add filters
    if (rarity) query.rarity = rarity;
    if (wear) query.wear = wear;
    if (minPrice || maxPrice) {
      query.listingPrice = {};
      if (minPrice) query.listingPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.listingPrice.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { skinName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const items = await InventoryItem.find(query)
      .populate('owner', 'username')
      .sort({ listedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await InventoryItem.countDocuments(query);

    res.status(200).json({
      success: true,
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get marketplace error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching marketplace",
    });
  }
};
