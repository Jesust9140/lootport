import React from 'react';
import { Outlet } from 'react-router-dom';
// import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // Import Footer component

const Layout = () => {
  return (
    <>
      <main style={{ paddingBottom: "4rem" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
