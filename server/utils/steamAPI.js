import fetch from 'node-fetch';

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_API_BASE = 'https://api.steampowered.com';

// Steam Web API helper functions
export const steamAPI = {
  // Get player summaries (basic profile info)
  async getPlayerSummaries(steamIds) {
    try {
      const steamIdList = Array.isArray(steamIds) ? steamIds.join(',') : steamIds;
      const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamIdList}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data.response?.players || [];
    } catch (error) {
      console.error('Steam API - GetPlayerSummaries error:', error);
      throw error;
    }
  },

  // Get CS2 inventory for a player
  async getPlayerInventory(steamId64) {
    try {
      const url = `${STEAM_API_BASE}/IEconItems_730/GetPlayerItems/v0001/?key=${STEAM_API_KEY}&steamid=${steamId64}&format=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Inventory is private');
        }
        throw new Error(`Steam API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.result?.status !== 1) {
        throw new Error('Failed to fetch inventory');
      }
      
      return data.result?.items || [];
    } catch (error) {
      console.error('Steam API - GetPlayerInventory error:', error);
      throw error;
    }
  },

  // Get CS2 item schema (item definitions)
  async getGameSchema() {
    try {
      const url = `${STEAM_API_BASE}/IEconItems_730/GetSchema/v0002/?key=${STEAM_API_KEY}&language=english&format=json`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data.result || {};
    } catch (error) {
      console.error('Steam API - GetSchema error:', error);
      throw error;
    }
  },

  // Get player bans
  async getPlayerBans(steamIds) {
    try {
      const steamIdList = Array.isArray(steamIds) ? steamIds.join(',') : steamIds;
      const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerBans/v1/?key=${STEAM_API_KEY}&steamids=${steamIdList}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data.players || [];
    } catch (error) {
      console.error('Steam API - GetPlayerBans error:', error);
      throw error;
    }
  },

  // Get player's Steam level
  async getSteamLevel(steamId64) {
    try {
      const url = `${STEAM_API_BASE}/IPlayerService/GetSteamLevel/v1/?key=${STEAM_API_KEY}&steamid=${steamId64}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data.response?.player_level || 0;
    } catch (error) {
      console.error('Steam API - GetSteamLevel error:', error);
      return 0;
    }
  },

  // Get recently played games
  async getRecentlyPlayedGames(steamId64) {
    try {
      const url = `${STEAM_API_BASE}/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamId64}&format=json`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data.response?.games || [];
    } catch (error) {
      console.error('Steam API - GetRecentlyPlayedGames error:', error);
      return [];
    }
  },

  // Convert Steam ID formats
  steamIdConverter: {
    // Convert SteamID64 to SteamID32
    toSteamId32(steamId64) {
      const steamId64BigInt = BigInt(steamId64);
      const steamId32 = Number(steamId64BigInt - BigInt('76561197960265728'));
      return steamId32;
    },

    // Convert SteamID32 to SteamID64
    toSteamId64(steamId32) {
      const steamId64 = BigInt(steamId32) + BigInt('76561197960265728');
      return steamId64.toString();
    },

    // Convert to Steam community URL
    toCommunityUrl(steamId64) {
      return `https://steamcommunity.com/profiles/${steamId64}`;
    }
  }
};

// CS2 Item rarity colors and grades
export const CS2_RARITIES = {
  'consumer': { color: '#b0c3d9', grade: 'Consumer Grade' },
  'industrial': { color: '#5e98d9', grade: 'Industrial Grade' },
  'milspec': { color: '#4b69ff', grade: 'Mil-Spec Grade' },
  'restricted': { color: '#8847ff', grade: 'Restricted' },
  'classified': { color: '#d32ce6', grade: 'Classified' },
  'covert': { color: '#eb4b4b', grade: 'Covert' },
  'contraband': { color: '#e4ae39', grade: 'Contraband' }
};

// CS2 Item conditions
export const CS2_CONDITIONS = {
  'Factory New': { abbreviation: 'FN', wear: [0.0, 0.07] },
  'Minimal Wear': { abbreviation: 'MW', wear: [0.07, 0.15] },
  'Field-Tested': { abbreviation: 'FT', wear: [0.15, 0.38] },
  'Well-Worn': { abbreviation: 'WW', wear: [0.38, 0.45] },
  'Battle-Scarred': { abbreviation: 'BS', wear: [0.45, 1.0] }
};

export default steamAPI;
