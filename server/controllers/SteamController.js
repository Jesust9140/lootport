import SteamAccount from "../models/SteamAccount.js";
import InventoryItem from "../models/InventoryItem.js";
import User from "../models/User.js";
import crypto from "crypto";
import { steamAPI, CS2_RARITIES, CS2_CONDITIONS } from "../utils/steamAPI.js";

// Steam API configuration
const STEAM_API_KEY = process.env.STEAM_API_KEY;

// @desc    Connect Steam account to user
// @route   POST /api/steam/connect
// @access  Private
export const connectSteamAccount = async (req, res) => {
  try {
    const { steamId64, profileUrl, displayName, avatar } = req.body;

    // Check if Steam account is already connected to another user
    const existingSteamAccount = await SteamAccount.findOne({ steamId64 });
    if (existingSteamAccount && existingSteamAccount.user.toString() !== req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "This Steam account is already connected to another user"
      });
    }

    // Check if user already has a Steam account connected
    const userSteamAccount = await SteamAccount.findOne({ user: req.user.userId });
    if (userSteamAccount) {
      // Update existing connection
      userSteamAccount.steamId64 = steamId64;
      userSteamAccount.profileUrl = profileUrl;
      userSteamAccount.displayName = displayName;
      userSteamAccount.avatar = avatar;
      userSteamAccount.isVerified = false; // Reset verification
      await userSteamAccount.save();

      return res.status(200).json({
        success: true,
        message: "Steam account updated",
        steamAccount: userSteamAccount
      });
    }

    // Create new Steam account connection
    const steamAccount = await SteamAccount.create({
      user: req.user.userId,
      steamId: steamId64, // We'll convert this if needed
      steamId64,
      profileUrl,
      displayName,
      avatar,
      isVerified: false
    });

    res.status(201).json({
      success: true,
      message: "Steam account connected. Please verify your account.",
      steamAccount
    });
  } catch (error) {
    console.error("Connect Steam account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error connecting Steam account",
    });
  }
};

// @desc    Get Steam profile info with enhanced data
// @route   GET /api/steam/profile
// @access  Private
export const getSteamProfile = async (req, res) => {
  try {
    const steamAccount = await SteamAccount.findOne({ user: req.user.userId });
    
    if (!steamAccount) {
      return res.status(404).json({
        success: false,
        message: "No Steam account connected"
      });
    }

    // Fetch comprehensive Steam data
    let enhancedSteamData = null;
    if (STEAM_API_KEY && steamAccount.steamId64) {
      try {
        console.log('🔍 Fetching enhanced Steam data for:', steamAccount.steamId64);
        
        // Get multiple Steam data points in parallel
        const [playerSummaries, playerBans, steamLevel, recentGames] = await Promise.allSettled([
          steamAPI.getPlayerSummaries(steamAccount.steamId64),
          steamAPI.getPlayerBans(steamAccount.steamId64),
          steamAPI.getSteamLevel(steamAccount.steamId64),
          steamAPI.getRecentlyPlayedGames(steamAccount.steamId64)
        ]);

        enhancedSteamData = {
          profile: playerSummaries.status === 'fulfilled' ? playerSummaries.value[0] : null,
          bans: playerBans.status === 'fulfilled' ? playerBans.value[0] : null,
          level: steamLevel.status === 'fulfilled' ? steamLevel.value : 0,
          recentGames: recentGames.status === 'fulfilled' ? recentGames.value : [],
          lastUpdated: new Date()
        };

        console.log('✅ Enhanced Steam data fetched successfully');
      } catch (apiError) {
        console.warn("⚠️ Steam API error:", apiError.message);
      }
    }

    res.status(200).json({
      success: true,
      steamAccount,
      enhancedData: enhancedSteamData
    });
  } catch (error) {
    console.error("❌ Get Steam profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching Steam profile",
    });
  }
};

// @desc    Generate verification code for Steam profile
// @route   POST /api/steam/verify/generate
// @access  Private
export const generateVerificationCode = async (req, res) => {
  try {
    const steamAccount = await SteamAccount.findOne({ user: req.user.userId });
    
    if (!steamAccount) {
      return res.status(404).json({
        success: false,
        message: "No Steam account connected"
      });
    }

    // Generate a unique verification code
    const verificationCode = `LootDrop-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    
    steamAccount.verificationCode = verificationCode;
    steamAccount.isVerified = false;
    await steamAccount.save();

    res.status(200).json({
      success: true,
      message: "Verification code generated",
      verificationCode,
      instructions: [
        "1. Go to your Steam profile",
        "2. Click 'Edit Profile'",
        "3. Add this code to your profile summary or name",
        "4. Save your profile",
        "5. Click 'Verify' button to complete verification"
      ]
    });
  } catch (error) {
    console.error("Generate verification code error:", error);
    res.status(500).json({
      success: false,
      message: "Server error generating verification code",
    });
  }
};

// @desc    Verify Steam account ownership
// @route   POST /api/steam/verify
// @access  Private
export const verifySteamAccount = async (req, res) => {
  try {
    const steamAccount = await SteamAccount.findOne({ user: req.user.userId });
    
    if (!steamAccount) {
      return res.status(404).json({
        success: false,
        message: "No Steam account connected"
      });
    }

    if (!steamAccount.verificationCode) {
      return res.status(400).json({
        success: false,
        message: "No verification code generated. Please generate one first."
      });
    }

    // In a real implementation, you would fetch the Steam profile and check if the code exists
    // For now, we'll simulate verification
    if (STEAM_API_KEY) {
      try {
        const response = await fetch(
          `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamAccount.steamId64}`
        );
        const data = await response.json();
        const player = data.response?.players?.[0];
        
        if (player) {
          // Check if verification code is in profile
          const profileText = (player.personaname || '') + (player.summary || '');
          if (profileText.includes(steamAccount.verificationCode)) {
            steamAccount.isVerified = true;
            steamAccount.verificationCode = null; // Clear the code
            await steamAccount.save();

            // Send notification
            const user = await User.findById(req.user.userId);
            await user.addNotification(
              "✅ Steam Account Verified!",
              "Your Steam account has been successfully verified. You can now sync your CS2 inventory.",
              "system"
            );

            return res.status(200).json({
              success: true,
              message: "Steam account verified successfully!"
            });
          }
        }
      } catch (apiError) {
        console.warn("Steam API verification error:", apiError);
      }
    }

    // Fallback: Manual verification (for demo)
    steamAccount.isVerified = true;
    steamAccount.verificationCode = null;
    await steamAccount.save();

    res.status(200).json({
      success: true,
      message: "Steam account verified successfully! (Demo mode)",
      note: "In production, this would verify against Steam API"
    });
  } catch (error) {
    console.error("Verify Steam account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error verifying Steam account",
    });
  }
};

// @desc    Import CS2 inventory from Steam
// @route   POST /api/steam/import-inventory
// @access  Private
export const importSteamInventory = async (req, res) => {
  try {
    const steamAccount = await SteamAccount.findOne({ user: req.user.userId });
    
    if (!steamAccount) {
      return res.status(404).json({
        success: false,
        message: "No Steam account connected"
      });
    }

    if (!steamAccount.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Steam account not verified. Please verify first."
      });
    }

    // In a real implementation, you would call Steam inventory API
    // For now, we'll create some demo items
    const demoItems = [
      {
        steamId: "demo_ak47_redline_001",
        itemName: "AK-47",
        skinName: "Redline",
        rarity: "Classified",
        wear: "Field-Tested",
        floatValue: 0.25,
        imageUrl: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGv7ctKXe1A6aV_X-1K5yOzxxcjr/110fx80f",
        steamMarketPrice: 45.50
      },
      {
        steamId: "demo_m4a4_asiimov_001",
        itemName: "M4A4",
        skinName: "Asiimov",
        rarity: "Covert",
        wear: "Well-Worn",
        floatValue: 0.42,
        imageUrl: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-GkvP9JrafxDoFsJwp2LqV946ijAXh_hJsNW37JNWQdwM2ZV-E8lnqyL--m9bi67sIdaFa/110fx80f",
        steamMarketPrice: 89.99
      },
      {
        steamId: "demo_awp_dragon_lore_001",
        itemName: "AWP",
        skinName: "Dragon Lore",
        rarity: "Covert",
        wear: "Minimal Wear",
        floatValue: 0.08,
        imageUrl: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SClvD7PYTQgGRu5cB1g_zMu9-t2wLk_kVpZW6mLYCRdlRvNQuG_FK5wefpjJG-6ZXBz3MwuiEh-z-DyKsM1ptu/110fx80f",
        steamMarketPrice: 2450.00
      }
    ];

    const importedItems = [];
    
    for (const item of demoItems) {
      // Check if item already exists
      const existingItem = await InventoryItem.findOne({
        owner: req.user.userId,
        steamId: item.steamId
      });

      if (!existingItem) {
        const inventoryItem = await InventoryItem.create({
          owner: req.user.userId,
          ...item
        });
        importedItems.push(inventoryItem);
      }
    }

    steamAccount.lastSync = new Date();
    await steamAccount.save();

    // Send notification
    const user = await User.findById(req.user.userId);
    await user.addNotification(
      "📦 Inventory Imported!",
      `Successfully imported ${importedItems.length} items from your Steam inventory.`,
      "system"
    );

    res.status(200).json({
      success: true,
      message: `Imported ${importedItems.length} new items from Steam`,
      importedItems,
      note: "This is demo data. In production, this would sync with Steam API."
    });
  } catch (error) {
    console.error("Import Steam inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error importing Steam inventory",
    });
  }
};

// @desc    Set trade URL
// @route   PUT /api/steam/trade-url
// @access  Private
export const setTradeUrl = async (req, res) => {
  try {
    const { tradeUrl } = req.body;
    
    const steamAccount = await SteamAccount.findOne({ user: req.user.userId });
    
    if (!steamAccount) {
      return res.status(404).json({
        success: false,
        message: "No Steam account connected"
      });
    }

    steamAccount.tradeUrl = tradeUrl;
    await steamAccount.save();

    res.status(200).json({
      success: true,
      message: "Trade URL updated successfully"
    });
  } catch (error) {
    console.error("Set trade URL error:", error);
    res.status(500).json({
      success: false,
      message: "Server error setting trade URL",
    });
  }
};
