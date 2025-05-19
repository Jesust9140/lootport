import React from "react";
import "../style.css"; // Assuming global styles are here

export default function FeaturedSlide() {
  return (
    <div className="Slide-content">
      <h3 className="Slide-title">
        Skin <span>Fever</span>
      </h3>
      <div className="Slide-description">
        Check out the hottest Skin Collection right now.
      </div>
      <div className="Slide-link">
        <a className="SubmitButton" href="/market?collection=1513">
          <div className="SubmitButton-title">Feel the Fever</div>
        </a>
      </div>
    </div>
  );
}
