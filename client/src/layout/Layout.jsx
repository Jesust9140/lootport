import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

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
