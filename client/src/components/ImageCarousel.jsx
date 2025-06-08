import { useState, useEffect } from "react";
import "../style.css";

const images = [
	{
		src: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=380/images/banners/IKuHT0brn3LWcnEMX7qGgqhLNFQ8N13mp0vwg46b.png",
		srcSet: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=760/images/banners/3CcuDnl1BOhr15lRP0BvtfLibfQJ0kG15M8U5vBr.png 2x",
		alt: "Connect with others",
	},
	{
		src: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=380/images/banners/NzF5DrPS0FXmjlzjRckZ3K5MeXL0aO9uyyYRA2wR.png",
		srcSet: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=760/images/banners/TaOugxjXcoPZQp8rFDLzYYnTWm9U4wnOpbo65vKN.png 2x",
		alt: "Sell your skins",
	},
	{
		src: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=380/images/banners/NzA1RvkTPgUVZtME2yQvTwAyJXXGZToOdS5Q0Gql.png",
		srcSet: "https://cdn.skinport.com/cdn-cgi/image/format=webp,quality=85,height=760/images/banners/cqF1jM5iKj0dOB9GDiwzNUTb8DkVXrHYXSKvJZgO.png 2x",
		alt: "Secure and fast",
	},
	{
		src: "https://images.ctfassets.net/nua5jmq7o9f6/3lJbNI9ejAErd360ouIMt4/36d05cade16e3e875ab16c365d5e6fb8/Thumbnail__19_.png?fm=webp&q=85&w=250",
		srcSet: "https://images.ctfassets.net/nua5jmq7o9f6/3lJbNI9ejAErd360ouIMt4/36d05cade16e3e875ab16c365d5e6fb8/Thumbnail__19_.png?fm=webp&q=85&w=500 2x",
		alt: "New Thumbnail 1",
	},
	{
		src: "https://images.ctfassets.net/nua5jmq7o9f6/5WsvGIJFEtu15gEbaxkIqX/6057cc408c88b74cfe351938f6616c32/Thumbnail__20_.png?fm=webp&q=85&w=250",
		srcSet: "https://images.ctfassets.net/nua5jmq7o9f6/5WsvGIJFEtu15gEbaxkIqX/6057cc408c88b74cfe351938f6616c32/Thumbnail__20_.png?fm=webp&q=85&w=500 2x",
		alt: "New Thumbnail 2",
	},
	{
		src: "https://images.ctfassets.net/nua5jmq7o9f6/7xp0HUN3zn7E3GvEEvveON/88eb5c667e7ddbc68258fc5a1e395b53/Thumbnail_1__43_.png?fm=webp&q=85&w=250",
		srcSet: "https://images.ctfassets.net/nua5jmq7o9f6/7xp0HUN3zn7E3GvEEvveON/88eb5c667e7ddbc68258fc5a1e395b53/Thumbnail_1__43_.png?fm=webp&q=85&w=500 2x",
		alt: "New Thumbnail 3",
	},
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
			{/* Image */}
			<img
				src={src}
				srcSet={srcSet}
				alt={alt}
				className="carousel-image"
				loading="lazy"
			/>

			{/* Left Arrow */}
			<button
				className="carousel-arrow left"
				onClick={prevSlide}
				aria-label="Previous Slide"
			>
				❮
			</button>

			{/* Right Arrow */}
			<button
				className="carousel-arrow right"
				onClick={nextSlide}
				aria-label="Next Slide"
			>
				❯
			</button>

			{/* Dots */}
			<div className="carousel-dots">
				{images.map((_, index) => (
					<span
						key={index}
						className={`dot ${index === currentIndex ? "active" : ""}`}
						onClick={() => goToSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
					></span>
				))}
			</div>
		</div>
	);
}