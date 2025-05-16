export default function Login() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <h2>Login to Your Account</h2>
      <form style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto', gap: '1rem' }}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
