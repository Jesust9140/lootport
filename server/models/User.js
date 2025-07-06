import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// TODO: need to add password reset tokens, email verification, 2FA
// also should add user preferences for notifications and privacy settings
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return this.authMethod !== 'steam';
    },
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: 'https://via.placeholder.com/100?text=User'
  },
  steamId: {
    type: String,
    default: null,
    sparse: true,
    unique: true // need to handle duplicate steam accounts better
  },
  steamProfileUrl: {
    type: String,
    default: null
  },
  authMethod: {
    type: String,
    enum: ['local', 'steam', 'hybrid'],
    default: 'local'
  },
  steamLinked: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    maxlength: 500, // might increase this later, 500 chars is pretty short
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // notifications array is getting unwieldy, should move to separate collection
  // for better performance and querying
  notifications: [{
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['sale', 'update', 'system', 'skin_sold', 'website_update'],
      default: 'system'
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

userSchema.methods.addNotification = function(title, message, type = 'system') {
  this.notifications.push({
    title,
    message,
    type,
    read: false,
    createdAt: new Date()
  });
  return this.save();
};

userSchema.methods.markNotificationRead = function(notificationId) {
  const notification = this.notifications.id(notificationId);
  if (notification) {
    notification.read = true;
    return this.save();
  }
  return Promise.resolve(this);
};

export default mongoose.model("User", userSchema);
