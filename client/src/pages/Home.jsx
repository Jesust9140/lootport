import React, { useEffect, useState } from "react";
import CategoryNav from "../components/CategoryNav";
import ImageCarousel from "../components/ImageCarousel";
import SkinList from "../components/SkinList";
import { fetchSkins } from "../api/skinAPI";
import axios from "axios";
// Main Home component
// This component serves as the landing page for the application
// It includes a navigation bar, an image carousel, a promotional section, and a list of available skins
// The component fetches skin data from the API and displays it in a grid format
// The component also includes a footer with my name
// The component uses React hooks for state management and side effects
// The component is styled using inline styles and CSS classes
// The component is exported as the default export of the module
// The component is wrapped in a div element to contain all the child components
// The component uses the useEffect hook to fetch data when the component mounts
// The component uses the useState hook to manage the state of the skins array
// The component uses the fetchSkins function from the skinAPI module to fetch skin data
// The component uses the CategoryNav component to display a navigation bar
// The component uses the ImageCarousel component to display a carousel of images
// The component uses the SkinList component to display a list of available skins
// The component uses inline styles to set the padding and text alignment of various sections
// The component uses a button to redirect the user to the API endpoint for viewing listings
// The component uses a footer to display my name
// The component uses a section element to group the promotional content
// The component uses a main element to group the main content of the page
// The component uses a div element to wrap the entire content of the page
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
      {/* Fixed Navigation */}
      <CategoryNav />

      {/* Content Wrapper */}
      <div style={{ paddingTop: "4.5rem" }}>
        {/* Image Carousel */}
        <ImageCarousel />

        {/* Promo Section */}
        <section className="promo-section" style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Welcome to Lootdrop Marketplace</h2>
          <p>
            Lootdrop is your trusted space to buy, sell, and explore premium Counter-Strike 2 skins. Built with gamers in mind, our platform puts speed, security, and great prices first — without the noise.
          </p>

          <div className="highlights" style={{ display: "flex", justifyContent: "space-around", marginTop: "2rem" }}>
            <div>
              <strong>Zero Buyer Fees</strong>
              <p>What you see is what you pay. No extra costs, no surprises.</p>
            </div>
            <div>
              <strong>Fast Transactions</strong>
              <p>Instant delivery through automated trade bots, 24/7.</p>
            </div>
            <div>
              <strong>Verified Reviews</strong>
              <p>Rated excellent by real users. We earn trust with transparency.</p>
            </div>
          </div>

          <div className="blog-preview" style={{ marginTop: "2rem" }}>
            <h3>Latest from the Blog</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><a href="/blog/m0nesy-settings">m0NESY Settings - Crosshair, Resolution, Hardware</a></li>
              <li><a href="/blog/case-hardened-guide">Five-SeveN Case Hardened Pattern Guide</a></li>
              <li><a href="/blog/gloves-budget">Top Gloves for CS2 on a Budget</a></li>
            </ul>
          </div>
        </section>

        {/* Main Content */}
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

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "#1f2937",
          color: "#fff",
        }}
      >
        <p class="headerfooter">&copy; Jesus Tabora</p>
      </footer>
    </div>
  );
}
