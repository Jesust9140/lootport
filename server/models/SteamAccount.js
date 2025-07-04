import mongoose from "mongoose";

const steamAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  steamId: {
    type: String,
    required: true,
    unique: true
  },
  steamId64: {
    type: String,
    required: true
  },
  profileUrl: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  avatar: {
    type: String // Steam avatar URL
  },
  profileState: {
    type: Number, // 1 = private, 3 = public
    default: 1
  },
  lastSync: {
    type: Date,
    default: null
  },
  inventoryPrivate: {
    type: Boolean,
    default: true
  },
  tradeUrl: {
    type: String, // Steam trade offer URL
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String, // Code user puts in Steam profile for verification
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
steamAccountSchema.index({ steamId: 1 });
steamAccountSchema.index({ steamId64: 1 });
steamAccountSchema.index({ user: 1 });

export default mongoose.model("SteamAccount", steamAccountSchema);
