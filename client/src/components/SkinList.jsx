import "./SkinList.css";

const SkinList = ({ skins }) => {
  const handleBuyClick = (skin) => {
    // For now, just show an alert - you can replace this with actual buy functionality
    alert(`Buy ${skin.name} for $${skin.price}? (Feature coming soon!)`);
  };

  if (skins.length === 0) {
    return (
      <div style={{ 
        padding: "3rem 1rem", 
        textAlign: "center", 
        color: "#64748b",
        fontSize: "1.1rem"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎮</div>
        <p>No skins available at the moment.</p>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Check back soon for new items!
        </p>
      </div>
    );
  }

  return (
    <div className="skin-list">
      {skins.map((skin) => (
        <div key={skin._id} className="skin-card">
          <img src={skin.imageUrl} alt={skin.name} />
          <h3>{skin.name}</h3>
          <div className="wear">{skin.wear}</div>
          <div className="rarity">★ {skin.rarity}</div>
          <div className="price">${skin.price.toFixed(2)}</div>
          {skin.suggestedPrice && (
            <div style={{ 
              fontSize: "0.75rem", 
              color: "#64748b", 
              textDecoration: "line-through",
              marginTop: "0.25rem"
            }}>
              ${skin.suggestedPrice.toFixed(2)}
            </div>
          )}
          <button 
            className="buy-button"
            onClick={() => handleBuyClick(skin)}
          >
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default SkinList;