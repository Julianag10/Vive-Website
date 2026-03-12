import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin-login.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // routing decision:
  // If login succeeds → go to /admin
  // If it fails → stay here”
  const navigate = useNavigate();

  // admin clicks login
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); // clears old error before trying again

    const res = await fetch("/admin/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      // 🔑 REQUIRED
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    // login Success path:
    // Session is now set
    // session already existed -> cookie already stored
    navigate("/admin");
  }

  return (
    <div className="admin-login">
      <h1>Admin Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="admin-login-error">{error}</p>}

        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
