import { useNavigate } from "react-router-dom";
import "../components/Styles/Register.css";
import "../components/Styles/Login.css"; // Import for shared button styles

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <main className="page-content">
        <div className="register-container">
          {/* Close Button */}
          
<div className="button-wrapper">
  <button className="lootdrop-button" onClick={() => navigate("/")}>Lootdrop</button>
  <button className="close-button" onClick={() => navigate("/")}>✕</button>
</div>


          <h2>Create Your Account</h2>
          <form className="register-form">
            <input type="text" placeholder="Username" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <button type="submit">Register</button>
          </form>
        </div>
      </main>
    </div>
  );
}
