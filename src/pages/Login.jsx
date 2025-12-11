import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // EMAIL LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const savedUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!savedUser) {
      alert("Invalid email or password");
      return;
    }

    alert("Login successful!");
    localStorage.setItem("loggedInUser", JSON.stringify(savedUser));

    // Role-based navigation
    if (savedUser.role === "ngo") navigate("/ngo-dashboard");
    else if (savedUser.role === "acceptor") navigate("/acceptor-dashboard");
    else navigate("/donor-dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="logo-title">ShareBite</h1>
        <p className="logo-subtitle">Donate food, feed hope.</p>
        <h2 className="login-title">Welcome Back</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Log In
          </button>

          <div className="login-footer">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>

      </div>
    </div>
  );
}
