import "./SkinList.css";




const SkinList = ({ skins }) => (
  <div className="skin-list">
    {skins.map((skin) => (
      <div key={skin._id} className="skin-card">
        <img src={skin.image} alt={skin.name} />
        <div>{skin.name}</div>
        <div>${skin.price}</div>
      </div>
    ))}
  </div>
);

export default SkinList;