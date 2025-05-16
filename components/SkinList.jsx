import React from "react";

const SkinList = ({ skins }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {skins.map((skin) => (
        <div key={skin._id} style={{ border: "1px solid #ccc", padding: "10px" }}>
          <img src={skin.imageUrl} alt={skin.name} width="100" />
          <h4>{skin.name}</h4>
          <p>Price: ${skin.price}</p>
          <p>Float: {skin.float}</p>
        </div>
      ))}
    </div>
  );
};

export default SkinList;
