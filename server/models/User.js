import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    unique: true
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
    maxlength: 500,
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

// Hash password before saving
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

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Add notification method
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

// Mark notification as read
userSchema.methods.markNotificationRead = function(notificationId) {
  const notification = this.notifications.id(notificationId);
  if (notification) {
    notification.read = true;
    return this.save();
  }
  return Promise.resolve(this);
};

export default mongoose.model("User", userSchema);
