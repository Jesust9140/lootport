export default function Login() {
  return (
    <div className="app-container">
      <main className="page-content">
        <div className="login-container">
          <h2>Login to Your Account</h2>
          <form className="login-form">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>
      </main>
    </div>
  );
}
