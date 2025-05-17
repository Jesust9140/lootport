import React from "react";

export default function SkinList({ skins }) {
  if (!skins || skins.length === 0) return <div>No skins found.</div>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {skins.map((skin) => (
        <div key={skin._id} style={{ border: "1px solid #ccc", padding: "10px" }}>
          <img src={skin.imageUrl} alt={skin.name} style={{ width: 100 }} />
          <div>{skin.name}</div>
          <div>${skin.price}</div>
        </div>
      ))}
    </div>
  );
}
