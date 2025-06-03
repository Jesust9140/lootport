import React, { useEffect, useState } from "react";
import ImageCarousel from "../components/ImageCarousel";
import SkinList from "../components/SkinList";
import { fetchSkins } from "../api/skinAPI";

export default function Home() {
  const [skins, setSkins] = useState([]);
  // const [dropdowns, setDropdowns] = useState({
  //   rifles: false,
  //   pistols: false,
  //   smgs: false,
  //   heavy: false,
  //   agent: false,
  //   sticker: false,
  //   container: false,
  //   key: false,
  //   patch: false,
  //   collectibles: false,
  //   pass: false,
  //   musicKit: false,
  // });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSkins();
        setSkins(data);
      } catch (error) {
        console.error("Error fetching skins:", error);
      }
    };
    load();
  }, []);

  return (
    <div className="home-container">
      {/* Top Navigation */}
      {/* <div className="top-nav">
        <div className="nav-left">
          <img src="/concept2.png" alt="Logo" className="logo-image" />
          <span className="brand">Lootdrop</span>
        </div>
        <div className="nav-search">
          <input type="text" className="search-input" placeholder="Search for skins..." />
        </div>
        <div className="nav-right">
          <a href="/login" className="auth-link">Login</a>
          <a href="/register" className="auth-link">Register</a>
        </div>
      </div> */}

      {/* Category Bar */}
      {/* <div className="category-bar">
        {[
          { name: "Rifles", key: "rifles" },
          { name: "Pistols", key: "pistols" },
          { name: "SMGs", key: "smgs" },
          { name: "Heavy", key: "heavy" },
          { name: "Agent", key: "agent" },
          { name: "Sticker", key: "sticker" },
          { name: "Container", key: "container" },
          { name: "Key", key: "key" },
          { name: "Patch", key: "patch" },
          { name: "Collectibles", key: "collectibles" },
          { name: "Pass", key: "pass" },
          { name: "Music Kit", key: "musicKit" },
        ].map((category) => (
          <div key={category.key} className="cat-dropdown">
            <a
              href={`/${category.key}`}
              className="cat-link"
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown(category.key);
              }}
            >
              {category.name}
            </a>
            {dropdowns[category.key] && (
              <div className="dropdown-menu">
                {skins
                  .filter((skin) => skin.category?.toLowerCase() === category.key)
                  .slice(0, 3) // Show only 3 preview items
                  .map((skin) => (
                    <div className="preview-card" key={skin._id}>
                      <img src={skin.imageUrl} alt={skin.name} className="preview-img" />
                      <div className="preview-info">
                        <div className="preview-title">{skin.name}</div>
                        <div className="preview-meta">
                          <span className="preview-price">${skin.price.toFixed(2)}</span>
                          {skin.suggestedPrice && (
                            <span className="preview-suggested">
                              Suggested: ${skin.suggestedPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="preview-tags">
                          <span className={`rarity-tag ${skin.rarity?.toLowerCase()}`}>{skin.rarity}</span>
                          <span className="wear-tag">{skin.wear}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                {skins.filter((skin) => skin.category?.toLowerCase() === category.key).length === 0 && (
                  <div className="dropdown-item">No items found</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div> */}

      {/* Content Wrapper */}
      <div className="page-content">
        {/* Image Carousel */}
        <ImageCarousel />

        {/* Promo Section */}
        <section className="promo-section" style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Welcome to Lootdrop Marketplace</h2>
          <p>
            Lootdrop is your trusted space to buy, sell, and explore premium Counter-Strike 2 skins. Built with gamers in mind, our platform puts speed, security, and great prices first — without the noise.
          </p>
        </section>

        {/* Main Content */}
        <main style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Find Skins Here!</h1>
          <p>Buy and sell your CS2 skins with trust.</p>
          <SkinList skins={skins} />
        </main>

        {/* Sticky Item Box */}
        <div className="sticky-item-box">
          <div className="item-card">
            <img
              className="item-image"
              src="https://community.cloudflare.steamstatic.com/economy/image/class/730/520114340/256x128"
              alt="Butterfly Knife | Slaughter"
            />
            <div className="item-info">
              <div className="item-title">★ Butterfly Knife | Slaughter</div>
              <div className="item-subtitle">Minimal Wear ★ Covert Knife</div>
              <div className="item-price">
                <span className="current-price">$2,566.87</span>
                <span className="old-price">Suggested price $3,009.48</span>
              </div>
            </div>
          </div>
          <div className="item-card">
            <img
              className="item-image"
              src="https://community.cloudflare.steamstatic.com/economy/image/class/730/520114341/256x128"
              alt="AK-47 | Redline"
            />
            <div className="item-info">
              <div className="item-title">AK-47 | Redline</div>
              <div className="item-subtitle">Field-Tested ★ Classified Rifle</div>
              <div className="item-price">
                <span className="current-price">$42.50</span>
                <span className="old-price">Suggested price $55.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
