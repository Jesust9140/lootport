import React, { useEffect, useState } from "react";
import { fetchSkins } from "../api/skinAPI";
import SkinList from "../components/SkinList";
import "../style.css"; // Ensure your CSS is correctly imported

export default function Home() {
  const [skins, setSkins] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchSkins();
      setSkins(data);
    };
    load();
  }, []);

  return (
    <div>
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
      </main>

      <footer style={{ textAlign: "center", padding: "1rem", backgroundColor: "#1f2937", color: "#fff" }}>
        <p>&copy; Jesus Tabora</p>
      </footer>
    </div>
  );
}