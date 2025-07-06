import mongoose from "mongoose";

// TODO: need to add payment method tracking, dispute resolution
// after researching skinport, need escrow system, verification, fraud detection
// also should track transaction fees more granularly for accounting
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
    default: 0 // currently 0% but will need to implement fee structure
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
    // need to add 'escrow_pending', 'verification_required' like skinport
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
    ipAddress: String, // track for fraud detection like skinport
    userAgent: String,
    paymentProvider: String,
    paymentId: String
    // TODO: add fraud score, geolocation, device fingerprint
    // also need affiliate tracking for marketing attribution
    // geoLocation: String, - for regional pricing
    // deviceFingerprint: String, - security
    // affiliateId: String, - revenue sharing
    // fraudScore: Number, - risk assessment
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
    // format similar to skinport for consistency
    this.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  
  // Calculate platform fee like skinport (5%) - this is our main revenue stream
  if (this.salePrice && !this.platformFee) {
    this.platformFee = Math.round(this.salePrice * 0.05 * 100) / 100; // 5% platform fee
    this.sellerReceives = this.salePrice - this.platformFee;
  }
  
  next();
});

// these indexes are crucial for performance as we scale like skinport did
transactionSchema.index({ buyer: 1, transactionDate: -1 });
transactionSchema.index({ seller: 1, transactionDate: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ transactionId: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
