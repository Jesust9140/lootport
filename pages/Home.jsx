import React, { useEffect, useState } from "react";
import { fetchSkins } from "../api/skinAPI";
import SkinList from "../components/SkinList";

function Home() {
  const [skins, setSkins] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchSkins();
      setSkins(data);
    };
    load();
  }, []);

  return (
    <div>
      <h2>Available Skins</h2>
      <SkinList skins={skins} />
    </div>
  );
}
function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Welcome to Lootdrop</h1>
      <p>Buy and sell CS2 skins securely</p>
    </div>
  );
}

export default Home;
