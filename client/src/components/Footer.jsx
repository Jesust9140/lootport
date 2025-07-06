import "./Footer.css";

// simple footer, might add social media links and newsletter signup later
export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 Lootdrop. All rights reserved.</p>
      <div className="footer-links">
        {/* these pages dont exist yet, need to create them */}
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/contact">Contact Us</a>
      </div>
    </footer>
  );
}