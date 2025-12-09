import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    // Get saved user from localStorage
    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!savedUser) {
      setError("No user found. Please register first.");
      return;
    }

    // Compare entered email/password with saved user
    if (savedUser.email !== email || savedUser.password !== password) {
      setError("Invalid email or password.");
      return;
    }

    // Save logged-in user
    localStorage.setItem("loggedInUser", JSON.stringify(savedUser));

    // Redirect to Donor Dashboard
    navigate("/donor-dashboard");
  }

  return (
    <div className="login-container">
      <div className="login-card">

        {error && <p style={{ color: "red" }}>{error}</p>}

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

          <button type="submit" className="login-btn">Log In</button>

          <div className="login-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
