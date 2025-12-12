import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---------------- LOGIN FUNCTION ----------------
  const handleLogin = (e) => {
    e.preventDefault();

    // Read all registered users
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    // Find matching user
    const savedUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!savedUser) {
      alert("Invalid email or password.");
      return;
    }

    // Save logged-in user
    localStorage.setItem("loggedInUser", JSON.stringify(savedUser));
    alert("Login successful!");

    // Redirect based on role
    switch (savedUser.role) {
      case "donor":
        navigate("/donor-dashboard");
        break;

      case "ngo":
        navigate("/ngo-dashboard");
        break;

      case "acceptor":
        navigate("/acceptor-dashboard");
        break;

      default:
        alert("User role not found.");
        navigate("/login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="logo-title">ShareBite</h1>
        <p className="logo-subtitle">Donate food, feed hope.</p>
        <h2 className="login-title">Welcome Back</h2>

        {/* FORM */}
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

          {/* FOOTER */}
          <div className="login-footer">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </div>

        </form>
      </div>
    </div>
  );
}
