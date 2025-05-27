export default function Register() {
  return (
    <div className="app-container">
      <main className="page-content">
        <div className="register-container">
          <h2>Create Your Account</h2>
          <form className="register-form">
            <input type="text" placeholder="Username" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <button type="submit">Register</button>
          </form>
        </div>
      </main>
    </div>
  );
}
