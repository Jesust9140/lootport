import "./Footer.css";

// simple footer, might add social media links and newsletter signup later
// after researching skinport, need to add trust badges and security info here too
export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 Lootdrop. All rights reserved.</p>
      <div className="footer-links">
        {/* these pages dont exist yet, need to create them */}
        {/* based on skinport research, terms and privacy are crucial for trust */}
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/contact">Contact Us</a>
        {/* TODO: add security page explaining our escrow system like skinport */}
        {/* also need FAQ and help center for user support */}
      </div>
    </footer>
  );
}