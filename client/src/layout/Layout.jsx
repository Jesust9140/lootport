import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// simple layout component, might add breadcrumbs and loading states later
const Layout = () => {
  const location = useLocation();

  // this logic is kinda hacky, should use route config instead
  const isStaticPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/auth";

  // directly manipulating body class is not ideal, should use CSS-in-JS or context
  if (isStaticPage) {
    document.body.classList.add("static-page");
  } else {
    document.body.classList.remove("static-page");
  }

  return (
    <div>
      {/* conditional rendering works but maybe use a route wrapper instead */}
      {!isStaticPage && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!isStaticPage && <Footer />}
    </div>
  );
};

export default Layout;
