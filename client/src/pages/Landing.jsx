import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <h1>Welcome to Lootdrop</h1>
      <p>Buy and sell your CS2 skins securely</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
