// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import ImageCarousel from "../components/ImageCarousel";
import SkinList from "../components/SkinList";
import { fetchSkins } from "../api/skinAPI";

export default function Home() {
  const [skins, setSkins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load skins from backend
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSkins([
        {
          _id: "1",
          name: "AK-47 | Redline",
          imageUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RrM13T_FDrw-_ng5Pu75iY1zI97bhVm4j4",
          price: 24.99,
          wear: "Field-Tested",
          rarity: "Classified",
          suggestedPrice: 29.99,
        },
        {
          _id: "2",
          name: "M4A4 | Howl",
          imageUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwT09-5lpKKqPrxN7LEm1Rd6dd2j6eQ9N2t2wznqUo5YjvzLYSRdlU3aV7U_QC9kuvxxcjr7oOJlyVx2SkL",
          price: 2399.99,
          wear: "Minimal Wear",
          rarity: "Covert",
          suggestedPrice: 2499.99,
        },
        {
          _id: "3",
          name: "AWP | Dragon Lore",
          imageUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2D8G68Nz3-jCpd6t2wDm_0trNjvzd9KRdAE2aV7Y_lS9yb_vgJPu7ZrBwXsxu3Il5i2ImhSpn1gSOYJLOBB6",
          price: 8999.99,
          wear: "Factory New",
          rarity: "Covert",
          suggestedPrice: 9499.99,
        },
        {
          _id: "4",
          name: "Glock-18 | Fade",
          imageUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFAR17PLfYQJP7c-ikZKSqPrxN7LEmyVQ7MEpiLuVrN6t2FLk_Eo6NWymI9LAdlI5NV_W_Va3xebxxcjrQZBr7DE",
          price: 189.99,
          wear: "Factory New",
          rarity: "Restricted",
          suggestedPrice: 219.99,
        },
        {
          _id: "5",
          name: "USP-S | Kill Confirmed",
          imageUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWdY781lteXA54vwxgDj-ENsYWHxI9fHdAE6N1HU_gPqwOq80cO_ot2XnuTzl8KL",
          price: 67.50,
          wear: "Minimal Wear",
          rarity: "Classified",
          suggestedPrice: 79.99,
        },
        {
          _id: "6",
          name: "Karambit | Doppler",
          imageUrl: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-DkvbiKvWElzgIscMmiOuXo9n22AXnr0FvYW6ncYGVcw82aVCE_1Lrxb_s0Za56Z-czXV9-n51cJPOr8Y",
          price: 1299.99,
          wear: "Factory New",
          rarity: "Covert",
          suggestedPrice: 1399.99,
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="home-container">
      {/* Spacer added between navbar and carousel */}
      <div style={{ marginTop: isMobile ? "70px" : "60px" }}></div>

      {/* Image Carousel - Hide on mobile */}
      {!isMobile && <ImageCarousel />}

      {/* Promo Section */}
      <section className="promo-section" style={{ 
        padding: isMobile ? "1.5rem 1rem" : "2rem", 
        textAlign: "center" 
      }}>
        <h2 style={{ 
          fontSize: isMobile ? "1.5rem" : "2rem",
          marginBottom: "1rem"
        }}>
          Welcome to Lootdrop Marketplace
        </h2>
        <p style={{ 
          fontSize: isMobile ? "0.9rem" : "1rem",
          lineHeight: "1.6",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          Lootdrop is your trusted space to buy, sell, and explore premium Counter-Strike 2 skins.
          Built with gamers in mind, our platform puts speed, security, and great prices first — without the noise.
        </p>
      </section>

      {/* Main Content */}
      <main style={{ 
        textAlign: "center", 
        padding: isMobile ? "1rem" : "2rem" 
      }}>
        <h1 style={{ 
          fontSize: isMobile ? "1.8rem" : "2.5rem",
          marginBottom: "0.5rem"
        }}>
          Find Skins Here!
        </h1>
        <p style={{ 
          fontSize: isMobile ? "0.9rem" : "1.1rem",
          marginBottom: "2rem",
          color: "#64748b"
        }}>
          Buy and sell your CS2 skins with trust.
        </p>
        
        {isLoading ? (
          <div style={{ 
            padding: "2rem", 
            fontSize: isMobile ? "0.9rem" : "1rem",
            color: "#94a3b8"
          }}>
            Loading skins...
          </div>
        ) : (
          <SkinList skins={skins} />
        )}
      </main>

      {/* Sticky Item Box - Hide on mobile or show simplified version */}
      {!isMobile && (
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
      )}
    </div>
  );
}