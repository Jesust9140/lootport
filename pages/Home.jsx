// import React, { useEffect, useState } from "react";
// import { fetchSkins } from "../api/skinAPI";
// import SkinList from "../components/SkinList";
// import MoreDropdown from '../components/MoreDropdown';


// function Home() {
//   const [skins, setSkins] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       const data = await fetchSkins();
//       setSkins(data);
//     };
//     load();
//   }, []);

//   return (
//     <div>
//       <h2>Available Skins</h2>
//       <SkinList skins={skins} />
//     </div>
//   );
// }

// function Home() {
//   return (
//     <div>
//       <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
//         <h1 style={{ color: '#22d3ee' }}>Lootdrop</h1>
//         <MoreDropdown />
//       </nav>

//       <main style={{ textAlign: 'center', marginTop: '5rem' }}>
//         <h2>Welcome to Lootdrop</h2>
//       </main>
//     </div>
//   );
// }


// export default Home;
