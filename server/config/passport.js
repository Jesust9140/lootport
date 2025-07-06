import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import User from '../models/User.js';
import SteamAccount from '../models/SteamAccount.js';
import dotenv from 'dotenv';

dotenv.config();

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_RETURN_URL = process.env.STEAM_RETURN_URL || 'http://localhost:5000/api/auth/steam/return';
const STEAM_REALM = process.env.STEAM_REALM || 'http://localhost:5000/';

console.log('🎮 Steam Configuration:');
console.log('   API Key:', STEAM_API_KEY ? `✅ Set (${STEAM_API_KEY.substring(0, 8)}...)` : '❌ Missing');
console.log('   Return URL:', STEAM_RETURN_URL);
console.log('   Realm:', STEAM_REALM);

if (!STEAM_API_KEY) {
  console.warn('⚠️  Warning: STEAM_API_KEY not set. Steam authentication will not work properly.');
  console.warn('   Please set STEAM_API_KEY in your .env file');
} else {
  console.log('✅ Steam API Key configured successfully');
}

passport.use(new SteamStrategy({
  returnURL: STEAM_RETURN_URL,
  realm: STEAM_REALM,
  apiKey: STEAM_API_KEY,
  profile: true,
  stateless: false,
  headers: {
    'User-Agent': 'LootDrop Steam Integration v1.0'
  }
}, async (identifier, profile, done) => {
  try {
    console.log('🎮 Steam authentication initiated for:', profile.displayName);
    
    const steamId64 = profile.id;
    const steamId = profile._json?.steamid || steamId64;
    
    // Extract comprehensive profile data
    const profileData = {
      steamId64,
      steamId,
      displayName: profile.displayName,
      profileUrl: profile._json?.profileurl,
      avatar: profile._json?.avatarfull || profile._json?.avatarmedium || profile._json?.avatar,
      realName: profile._json?.realname,
      countryCode: profile._json?.loccountrycode,
      stateCode: profile._json?.locstatecode,
      cityId: profile._json?.loccityid,
      timeCreated: profile._json?.timecreated,
      personaState: profile._json?.personastate,
      communityVisibilityState: profile._json?.communityvisibilitystate,
      profileState: profile._json?.profilestate,
      lastLogoff: profile._json?.lastlogoff,
      commentPermission: profile._json?.commentpermission
    };

    console.log('📋 Steam profile data extracted:', {
      steamId64,
      displayName: profileData.displayName,
      avatar: profileData.avatar ? '✅' : '❌'
    });

    let steamAccount = await SteamAccount.findOne({ steamId64 });
    
    if (steamAccount) {
      console.log('👤 Existing Steam account found, updating data...');
      
      Object.assign(steamAccount, profileData);
      steamAccount.lastLogin = new Date();
      await steamAccount.save();
      
      const user = await User.findById(steamAccount.user);
      if (user) {
        console.log('✅ Steam user authenticated successfully:', user.username);
        return done(null, { user, steamAccount, isNewUser: false });
      } else {
        console.error('❌ Steam account exists but associated user not found');
        return done(new Error('Associated user not found'), null);
      }
    }

    console.log('🆕 New Steam user, preparing for account creation/linking...');
    
    return done(null, { steamProfile: profileData, isNewUser: true });
    
  } catch (error) {
    console.error('❌ Steam authentication error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((data, done) => {
  if (data.user) {
    done(null, { userId: data.user._id, type: 'user' });
  } else {
    done(null, { steamProfile: data.steamProfile, type: 'steam_profile' });
  }
});

passport.deserializeUser(async (data, done) => {
  try {
    if (data.type === 'user') {
      const user = await User.findById(data.userId);
      done(null, user);
    } else {
      done(null, data.steamProfile);
    }
  } catch (error) {
    done(error, null);
  }
});

export default passport;
