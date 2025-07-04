// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import ImageCarousel from "../components/ImageCarousel";
import SkinList from "../components/SkinList";
import { fetchSkins } from "../api/skinAPI";

export default function Home() {
  const [skins, setSkins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load skins from backend
  useEffect(() => {
    const loadSkins = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSkins();
        setSkins(data);
      } catch (error) {
        console.error("Error fetching skins:", error);
        setError("Could not fetch skins. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadSkins();
  }, []);

  return (
    <div className="home-container">
      {/* Spacer added between navbar and carousel */}
      <div style={{ marginTop: "60px" }}></div>

      {/* Image Carousel */}
      <ImageCarousel />

      {/* Promo Section */}
      <section className="promo-section" style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Welcome to Lootdrop Marketplace</h2>
        <p>
          Lootdrop is your trusted space to buy, sell, and explore premium Counter-Strike 2 skins.
          Built with gamers in mind, our platform puts speed, security, and great prices first — without the noise.
        </p>
      </section>

      {/* Main Content */}
      <main style={{ textAlign: "center", padding: "2rem" }}>
        <h1>Find Skins Here!</h1>
        <p>Buy and sell your CS2 skins with trust.</p>
        {isLoading && <p>Loading skins...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!isLoading && !error && <SkinList skins={skins} />}
      </main>

      {/* Sticky Item Box */}
      <div className="sticky-item-box">
        {skins.slice(0, 2).map((skin) => (
          <div className="item-card" key={skin._id}>
            <img className="item-image" src={skin.imageUrl} alt={skin.name} />
            <div className="item-info">
              <div className="item-title">{skin.name}</div>
              <div className="item-subtitle">
                {skin.wear} ★ {skin.rarity} Skin
              </div>
              <div className="item-price">
                <span className="current-price">${skin.price.toFixed(2)}</span>
                {skin.suggestedPrice && (
                  <span className="old-price">
                    Suggested price ${skin.suggestedPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}