import { useNavigate } from "react-router-dom";
import "../components/Styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <main className="page-content">
        <div className="login-container">
               {/* Close Button */}
          
<div className="button-wrapper">
  <button className="lootdrop-button" onClick={() => navigate("/")}>Lootdrop</button>
  <button className="close-button" onClick={() => navigate("/")}>✕</button>
</div>


          <h2>Login to Your Account</h2>
          <form className="login-form">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>
      </main>
    </div>
  );
}
