export default function Register() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <h2>Create a Lootdrop Account</h2>
      <form style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto', gap: '1rem' }}>
        <input type="text" placeholder="Username" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
