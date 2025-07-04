import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  steamId: {
    type: String,
    required: true // Steam item ID
  },
  itemName: {
    type: String,
    required: true
  },
  skinName: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['Consumer Grade', 'Industrial Grade', 'Mil-Spec', 'Restricted', 'Classified', 'Covert', 'Contraband'],
    required: true
  },
  wear: {
    type: String,
    enum: ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'],
    required: true
  },
  floatValue: {
    type: Number,
    min: 0,
    max: 1
  },
  imageUrl: {
    type: String,
    required: true
  },
  steamMarketPrice: {
    type: Number, // Current Steam market price
    default: 0
  },
  listingPrice: {
    type: Number, // User's listing price
    default: null
  },
  status: {
    type: String,
    enum: ['in_inventory', 'listed', 'sold', 'pending_trade'],
    default: 'in_inventory'
  },
  listedAt: {
    type: Date,
    default: null
  },
  soldAt: {
    type: Date,
    default: null
  },
  soldPrice: {
    type: Number,
    default: null
  },
  tradableAfter: {
    type: Date, // Steam trade hold
    default: null
  },
  inspectLink: {
    type: String // CS2 inspect link
  },
  stickers: [{
    name: String,
    imageUrl: String,
    wear: Number
  }],
  tags: [{
    category: String,
    name: String
  }]
}, {
  timestamps: true
});

// Index for efficient queries
inventoryItemSchema.index({ owner: 1, status: 1 });
inventoryItemSchema.index({ steamId: 1 });
inventoryItemSchema.index({ status: 1, listedAt: -1 });

export default mongoose.model("InventoryItem", inventoryItemSchema);
