import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inventoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  itemImage: {
    type: String,
    required: true
  },
  salePrice: {
    type: Number,
    required: true,
    min: 0
  },
  platformFee: {
    type: Number,
    required: true,
    default: 0
  },
  sellerReceives: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['steam_wallet', 'paypal', 'stripe', 'crypto'],
    default: 'steam_wallet'
  },
  transactionId: {
    type: String,
    unique: true
  },
  steamTradeUrl: {
    type: String,
    default: null
  },
  completedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  refundReason: {
    type: String
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    paymentProvider: String,
    paymentId: String
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});

// Generate unique transaction ID
transactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  
  // Calculate platform fee and seller receives amount
  if (this.salePrice && !this.platformFee) {
    this.platformFee = Math.round(this.salePrice * 0.05 * 100) / 100; // 5% platform fee
    this.sellerReceives = this.salePrice - this.platformFee;
  }
  
  next();
});

// Index for better query performance
transactionSchema.index({ buyer: 1, transactionDate: -1 });
transactionSchema.index({ seller: 1, transactionDate: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ transactionId: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
