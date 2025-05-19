import React, { useEffect, useState } from "react";
import CategoryNav from "../components/CategoryNav";
import ImageCarousel from "../components/ImageCarousel";
import SkinList from "../components/SkinList";
import { fetchSkins } from "../api/skinAPI";

export default function Home() {
  const [skins, setSkins] = useState([]);

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
    <div>
  
      <CategoryNav />

      <div style={{ paddingTop: "4.5rem" }}> {}
        <ImageCarousel />

        <main style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Welcome to Lootdrop</h1>
          <p>Buy and sell your CS2 skins with confidence.</p>
          <button
            onClick={() => (window.location.href = "/api/skins")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#22d3ee",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            View Listings
          </button>
          <h2>Available Skins</h2>
          <SkinList skins={skins} />
        </main>
      </div>

      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "#1f2937",
          color: "#fff",
        }}
      >
        <p>&copy; Jesus Tabora</p>
      </footer>
    </div>
  );
}
