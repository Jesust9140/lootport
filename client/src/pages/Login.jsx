import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with my actual API call
      console.log("Logging in with:", { email, password });
      // On successful login, i would  save a token
      // and navigate the user to their dashboard or back home.
      // navigate("/dashboard");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <main className="page-content">
        <div className="login-container">
          <div className="button-wrapper">
            <button className="lootdrop-button" onClick={() => navigate("/")}>Lootdrop</button>
            <button className="close-button" onClick={() => navigate("/")}>✕</button>
          </div>

          <h2>Login to Your Account</h2>
          {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
          <form className="login-form" onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
