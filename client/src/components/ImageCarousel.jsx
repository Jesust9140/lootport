import { useState, useEffect } from "react";
import "../style.css";

const images = [
  {
    src: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=380/images/banners/IKuHT0brn3LWcnEMX7qGgqhLNFQ8N13mp0vwg46b.png",
    srcSet: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=760/images/banners/3CcuDnl1BOhr15lRP0BvtfLibfQJ0kG15M8U5vBr.png 2x",
    alt: "Connect with others"
  },
  {
    src: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=380/images/banners/NzF5DrPS0FXmjlzjRckZ3K5MeXL0aO9uyyYRA2wR.png",
    srcSet: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=760/images/banners/TaOugxjXcoPZQp8rFDLzYYnTWm9U4wnOpbo65vKN.png 2x",
    alt: "Sell your skins"
  },
  {
    src: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=380/images/banners/NzA1RvkTPgUVZtME2yQvTwAyJXXGZToOdS5Q0Gql.png",
    srcSet: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=760/images/banners/cqF1jM5iKj0dOB9GDiwzNUTb8DkVXrHYXSKvJZgO.png 2x",
    alt: "Secure and fast"
  },
  {
    src: "https://via.placeholder.com/800x400?text=Example+Image+4",
    srcSet: "https://via.placeholder.com/1600x800?text=Example+Image+4+2x",
    alt: "Example Image 4"
  },
  {
    src: "https://via.placeholder.com/800x400?text=Example+Image+5",
    srcSet: "https://via.placeholder.com/1600x800?text=Example+Image+5+2x",
    alt: "Example Image 5"
  }
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [paused, currentIndex]);

  const { src, srcSet, alt } = images[currentIndex];

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <img
        src={src}
        srcSet={srcSet}
        alt={alt}
        className="carousel-image"
        loading="lazy"
      />

      <button className="carousel-arrow left" onClick={prevSlide}>
        ❮
      </button>
      <button className="carousel-arrow right" onClick={nextSlide}>
        ❯
      </button>

      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}