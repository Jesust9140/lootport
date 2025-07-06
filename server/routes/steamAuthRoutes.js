import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import SteamAccount from '../models/SteamAccount.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to set proper headers for Steam requests
const setSteamHeaders = (req, res, next) => {
  // Set User-Agent for Steam compatibility
  req.headers['user-agent'] = 'LootDrop Steam Integration v1.0 (localhost)';
  
  // Set additional headers that Steam might expect
  res.set({
    'X-Forwarded-Proto': 'http',
    'X-Forwarded-Host': 'localhost:5000'
  });
  
  next();
};

// @desc    Initiate Steam login
// @route   GET /api/auth/steam
// @access  Public
router.get('/steam', setSteamHeaders, passport.authenticate('steam', { 
  failureRedirect: '/auth?error=steam_failed',
  successRedirect: false 
}));

// @desc    Steam login callback
// @route   GET /api/auth/steam/return
// @access  Public
router.get('/steam/return', 
  passport.authenticate('steam', { failureRedirect: '/auth?error=steam_failed' }),
  async (req, res) => {
    try {
      console.log('🔄 Processing Steam callback...');
      const authData = req.user;
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      if (authData.isNewUser) {
        console.log('🆕 New Steam user detected, storing session data...');
        
        // New Steam user - store data in session for account creation/linking
        const steamProfile = authData.steamProfile;
        req.session.pendingSteamData = steamProfile;
        
        // Enhanced redirect with more data
        return res.redirect(`${baseUrl}/steam-linking?steam_id=${steamProfile.steamId64}&display_name=${encodeURIComponent(steamProfile.displayName)}`);
      }
      
      console.log('✅ Existing Steam user authenticated successfully');
      
      // Existing user - generate enhanced JWT and redirect
      const token = jwt.sign(
        { 
          userId: authData.user._id,
          email: authData.user.email,
          username: authData.user.username,
          role: authData.user.role,
          steamId: authData.steamAccount.steamId64,
          steamLinked: true
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      
      res.redirect(`${baseUrl}/auth-success?token=${token}&method=steam&welcome_back=true`);
      
    } catch (error) {
      console.error('❌ Steam callback error:', error);
      const errorUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${errorUrl}/auth?error=steam_callback_failed&details=${encodeURIComponent(error.message)}`);
    }
  }
);

// @desc    Complete Steam account linking for existing user
// @route   POST /api/auth/steam/link
// @access  Private
router.post('/steam/link', authenticate, async (req, res) => {
  try {
    const { steamId64 } = req.body;
    
    // Get Steam data from session (from callback)
    const steamProfile = req.session.pendingSteamData;
    
    if (!steamProfile || steamProfile.steamId64 !== steamId64) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Steam session data. Please try logging in with Steam again.'
      });
    }
    
    // Check if Steam account is already linked to another user
    const existingSteamAccount = await SteamAccount.findOne({ steamId64 });
    if (existingSteamAccount) {
      return res.status(400).json({
        success: false,
        message: 'This Steam account is already linked to another user.'
      });
    }
    
    // Create Steam account link
    const steamAccount = await SteamAccount.create({
      user: req.user.userId,
      steamId: steamProfile.steamId,
      steamId64: steamProfile.steamId64,
      displayName: steamProfile.displayName,
      profileUrl: steamProfile.profileUrl,
      avatar: steamProfile.avatar,
      realName: steamProfile.realName,
      countryCode: steamProfile.countryCode,
      isVerified: true, // Since it came from Steam OpenID, it's verified
      linkedAt: new Date()
    });
    
    // Clear pending Steam data
    delete req.session.pendingSteamData;
    
    // Add notification to user
    const user = await User.findById(req.user.userId);
    await user.addNotification(
      '🎮 Steam Account Linked!',
      `Successfully linked Steam account: ${steamProfile.displayName}`,
      'system'
    );
    
    res.status(200).json({
      success: true,
      message: 'Steam account successfully linked!',
      steamAccount
    });
    
  } catch (error) {
    console.error('Steam link error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error linking Steam account'
    });
  }
});

// @desc    Create new account with Steam
// @route   POST /api/auth/steam/register
// @access  Public
router.post('/steam/register', async (req, res) => {
  try {
    const { steamId64, email, username } = req.body;
    
    // Get Steam data from session
    const steamProfile = req.session.pendingSteamData;
    
    if (!steamProfile || steamProfile.steamId64 !== steamId64) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Steam session data. Please try logging in with Steam again.'
      });
    }
    
    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email or username already exists'
      });
    }
    
    // Check if Steam account is already linked
    const existingSteamAccount = await SteamAccount.findOne({ steamId64 });
    if (existingSteamAccount) {
      return res.status(400).json({
        success: false,
        message: 'This Steam account is already linked to another user.'
      });
    }
    
    // Create new user
    const user = await User.create({
      email,
      username,
      password: 'steam_auth_' + Date.now(), // Placeholder password for Steam users
      profilePicture: steamProfile.avatar,
      steamId: steamProfile.steamId64
    });
    
    // Create Steam account link
    const steamAccount = await SteamAccount.create({
      user: user._id,
      steamId: steamProfile.steamId,
      steamId64: steamProfile.steamId64,
      displayName: steamProfile.displayName,
      profileUrl: steamProfile.profileUrl,
      avatar: steamProfile.avatar,
      realName: steamProfile.realName,
      countryCode: steamProfile.countryCode,
      isVerified: true,
      linkedAt: new Date()
    });
    
    // Clear pending Steam data
    delete req.session.pendingSteamData;
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Add welcome notification
    await user.addNotification(
      '🎉 Welcome to LootDrop!',
      `Account created with Steam: ${steamProfile.displayName}`,
      'system'
    );
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully with Steam!',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture
      },
      steamAccount
    });
    
  } catch (error) {
    console.error('Steam register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating account with Steam'
    });
  }
});

// @desc    Test Steam API connectivity
// @route   GET /api/auth/steam/test
// @access  Public
router.get('/steam/test', async (req, res) => {
  try {
    const steamApiKey = process.env.STEAM_API_KEY;
    const testSteamId = '76561198000000000'; // Test Steam ID
    
    console.log('🧪 Testing Steam API connectivity...');
    console.log('   API Key:', steamApiKey ? 'Present' : 'Missing');
    console.log('   Return URL:', process.env.STEAM_RETURN_URL);
    console.log('   Realm:', process.env.STEAM_REALM);
    
    if (!steamApiKey) {
      return res.json({
        success: false,
        error: 'Steam API Key not configured',
        config: {
          returnUrl: process.env.STEAM_RETURN_URL,
          realm: process.env.STEAM_REALM
        }
      });
    }
    
    // Test Steam Web API
    const response = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${testSteamId}`);
    const data = await response.json();
    
    res.json({
      success: true,
      message: 'Steam API connectivity test successful',
      steamApiWorking: !!data.response,
      config: {
        returnUrl: process.env.STEAM_RETURN_URL,
        realm: process.env.STEAM_REALM,
        apiKeyStatus: 'configured'
      }
    });
    
  } catch (error) {
    console.error('❌ Steam API test failed:', error);
    res.json({
      success: false,
      error: error.message,
      config: {
        returnUrl: process.env.STEAM_RETURN_URL,
        realm: process.env.STEAM_REALM
      }
    });
  }
});

// @desc    Get Steam OpenID login URL manually (backup method)
// @route   GET /api/auth/steam/url
// @access  Public
router.get('/steam/url', (req, res) => {
  try {
    const returnUrl = encodeURIComponent(process.env.STEAM_RETURN_URL);
    const realm = encodeURIComponent(process.env.STEAM_REALM);
    
    const steamOpenIdUrl = `https://steamcommunity.com/openid/login?` +
      `openid.mode=checkid_setup&` +
      `openid.ns=http://specs.openid.net/auth/2.0&` +
      `openid.identity=http://specs.openid.net/auth/2.0/identifier_select&` +
      `openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&` +
      `openid.return_to=${returnUrl}&` +
      `openid.realm=${realm}`;
    
    console.log('🔗 Generated Steam OpenID URL:', steamOpenIdUrl);
    
    res.json({
      success: true,
      steamUrl: steamOpenIdUrl,
      debug: {
        returnUrl: process.env.STEAM_RETURN_URL,
        realm: process.env.STEAM_REALM,
        encoded: {
          returnUrl,
          realm
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to generate Steam URL:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Alternative Steam login using Steam Web API
// @route   POST /api/auth/steam/webapi
// @access  Public
router.post('/steam/webapi', async (req, res) => {
  try {
    const { steamId64 } = req.body;
    
    if (!steamId64) {
      return res.status(400).json({
        success: false,
        message: 'Steam ID is required'
      });
    }
    
    const steamApiKey = process.env.STEAM_API_KEY;
    if (!steamApiKey) {
      return res.status(500).json({
        success: false,
        message: 'Steam API not configured'
      });
    }
    
    // Get Steam profile data
    const profileResponse = await fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamId64}`
    );
    const profileData = await profileResponse.json();
    
    if (!profileData.response?.players?.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Steam ID or profile not found'
      });
    }
    
    const steamProfile = profileData.response.players[0];
    
    // Check if Steam account already exists
    let steamAccount = await SteamAccount.findOne({ steamId64 });
    let user = null;
    let isNewUser = false;
    
    if (steamAccount) {
      // Existing Steam account - find associated user
      user = await User.findById(steamAccount.userId);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Steam account exists but user not found'
        });
      }
    } else {
      // New Steam account - this will need linking or registration
      isNewUser = true;
    }
    
    if (isNewUser) {
      // Store Steam profile data for linking/registration
      const steamProfileData = {
        steamId64: steamProfile.steamid,
        displayName: steamProfile.personaname,
        profileUrl: steamProfile.profileurl,
        avatar: steamProfile.avatarfull || steamProfile.avatarmedium || steamProfile.avatar,
        realName: steamProfile.realname,
        countryCode: steamProfile.loccountrycode,
        isPublic: steamProfile.communityvisibilitystate === 3
      };
      
      return res.json({
        success: true,
        isNewUser: true,
        steamProfile: steamProfileData,
        message: 'Steam profile verified. Please complete account linking or registration.'
      });
    }
    
    // Existing user - generate JWT and return
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        steamId: steamAccount.steamId64,
        steamLinked: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      isNewUser: false,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      steamAccount: {
        steamId64: steamAccount.steamId64,
        displayName: steamAccount.displayName
      },
      token,
      message: 'Steam authentication successful'
    });
    
  } catch (error) {
    console.error('❌ Steam Web API authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Steam authentication failed',
      error: error.message
    });
  }
});

export default router;
