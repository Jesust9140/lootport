import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skin',
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
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
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
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  steamTradeUrl: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
transactionSchema.index({ userId: 1, transactionDate: -1 });
transactionSchema.index({ type: 1, transactionDate: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
