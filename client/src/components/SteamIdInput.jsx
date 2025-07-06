import React, { useState } from 'react';
import './Styles/SteamIdInput.css';

const SteamIdInput = ({ onSteamAuth, loading = false }) => {
  const [steamInput, setSteamInput] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Extract Steam ID from various Steam URL formats
  const extractSteamId = (input) => {
    const cleanInput = input.trim();
    
    // Already a Steam ID64
    if (/^\d{17}$/.test(cleanInput)) {
      return cleanInput;
    }
    
    // Steam profile URL patterns
    const urlPatterns = [
      /steamcommunity\.com\/profiles\/(\d{17})/,
      /steamcommunity\.com\/id\/([^/?]+)/,
      /s\.team\/p\/([^/?]+)/
    ];
    
    for (const pattern of urlPatterns) {
      const match = cleanInput.match(pattern);
      if (match) {
        if (pattern.source.includes('profiles')) {
          return match[1]; // Direct Steam ID64
        } else {
          // Custom URL - would need Steam API to resolve
          return { customUrl: match[1] };
        }
      }
    }
    
    // Assume it's a custom URL if it doesn't match patterns
    if (cleanInput.length > 0 && !/^\d+$/.test(cleanInput)) {
      return { customUrl: cleanInput };
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    try {
      const steamId = extractSteamId(steamInput);
      
      if (!steamId) {
        throw new Error('Please enter a valid Steam ID, Steam profile URL, or Steam username');
      }

      if (typeof steamId === 'object' && steamId.customUrl) {
        // For custom URLs, we'd need to resolve them first
        // For now, show instructions to user
        throw new Error('Custom Steam URLs are not supported yet. Please use your 17-digit Steam ID or profile URL with numbers.');
      }

      // Call the authentication function
      await onSteamAuth(steamId);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e) => {
    setSteamInput(e.target.value);
    if (error) setError(''); // Clear error when user types
  };

  return (
    <div className="steam-id-input">        <div className="steam-id-input__header">
          <div className="steam-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
              <path d="M15.9 0C7.1 0 0 7.1 0 15.9c0 7.9 5.8 14.4 13.4 15.7l2.9-4.2c-0.8-0.3-1.5-0.9-1.9-1.7L9.1 27.1C4.4 25.2 1.1 20.9 1.1 15.9c0-8.2 6.6-14.8 14.8-14.8s14.8 6.6 14.8 14.8c0 5-2.5 9.4-6.3 12.1l-2.1-3.1c2.8-1.9 4.6-5.1 4.6-8.7 0-5.8-4.7-10.5-10.5-10.5s-10.5 4.7-10.5 10.5c0 1.8 0.5 3.5 1.3 4.9l4.2-1.7c-0.2-0.5-0.3-1.1-0.3-1.7 0-2.6 2.1-4.7 4.7-4.7s4.7 2.1 4.7 4.7-2.1 4.7-4.7 4.7c-0.1 0-0.2 0-0.3 0l-1.8 4.4c0.7 0.1 1.4 0.2 2.1 0.2C24.9 31.8 32 24.7 32 15.9S24.9 0 15.9 0z"/>
            </svg>
          </div>
          <h3>Steam Authentication</h3>
          <p>We'll verify your Steam account and link it to your LootDrop account</p>
        </div>

      <form onSubmit={handleSubmit} className="steam-id-form">
        <div className="input-group">
          <label htmlFor="steamInput">Steam ID or Profile URL</label>
          <input
            id="steamInput"
            type="text"
            value={steamInput}
            onChange={handleInputChange}
            placeholder="76561198000000000 or https://steamcommunity.com/profiles/..."
            disabled={loading || isValidating}
            className={error ? 'error' : ''}
          />
          <div className="input-help">
            Accepted formats:
            <ul>
              <li>Steam ID64: <code>76561198000000000</code></li>
              <li>Profile URL: <code>steamcommunity.com/profiles/76561198000000000</code></li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!steamInput.trim() || loading || isValidating}
          className="steam-auth-btn"
        >
          {isValidating ? (
            <>
              <span className="spinner"></span>
              Validating Steam Account...
            </>
          ) : loading ? (
            <>
              <span className="spinner"></span>
              Authenticating...
            </>
          ) : (
            <>
              <span className="steam-icon">🎮</span>
              Continue with Steam
            </>
          )}
        </button>
      </form>

      <div className="steam-help">
        <details>
          <summary>How to find your Steam ID</summary>
          <ol>
            <li>Open Steam and go to your profile</li>
            <li>Copy the URL from your browser</li>
            <li>If it shows numbers like <code>/profiles/76561198000000000</code>, that's your Steam ID64</li>
            <li>If it shows a custom name like <code>/id/username</code>, please use the numeric version</li>
          </ol>
        </details>
      </div>
    </div>
  );
};

export default SteamIdInput;
