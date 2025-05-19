import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
  return (
    <>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
