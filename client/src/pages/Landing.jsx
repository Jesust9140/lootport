import { Link } from 'react-router-dom';



export default function Landing


() {
  return (
    <div>
      <nav style={{
        width: '100%',
        padding: '1rem 2rem',
        backgroundColor: '#0f172a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ color: '#22d3ee', margin: 0 }}>Lootdrop</h1>
        <div>
          <Link to="/login" style={{ color: '#fff', marginRight: '1rem' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Register</Link>
        </div>
      </nav>
      <div style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <h1>Welcome to Lootdrop</h1>
        <p>Buy and sell your CS2 skins securely</p>
      </div>
    </div>
  );
}




