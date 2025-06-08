import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  const location = useLocation();

  // Check if the current page is login or register
  const isStaticPage = location.pathname === "/login" || location.pathname === "/register";

  // Add a class to the body for static pages
  if (isStaticPage) {
    document.body.classList.add("static-page");
  } else {
    document.body.classList.remove("static-page");
  }

  return (
    <div>
      {/* Render Navbar only if not on login or register pages */}
      {!isStaticPage && <Navbar />}
      <main>
        <Outlet />
      </main>
      {/* Render Footer only if not on login or register pages */}
      {!isStaticPage && <Footer />}
    </div>
  );
};

export default Layout;
