import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#1f2937', color: '#fff' }}>
      <Link to="/" style={{ marginRight: '1rem', color: '#fff' }}>Landing</Link>
      <Link to="/home" style={{ marginRight: '1rem', color: '#fff' }}>Home</Link>
      <Link to="/login" style={{ marginRight: '1rem', color: '#fff' }}>Login</Link>
      <Link to="/register" style={{ color: '#fff' }}>Register</Link>
    </nav>
  );
};

export default Navbar;
