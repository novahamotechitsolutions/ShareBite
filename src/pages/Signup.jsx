import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState("donor");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await register({ ...form, role });
    navigate("/login"); // redirect after signup
  }

  return (
    <div className="signup-container">
      <div className="signup-card">

        {/* Logo */}
        <div className="logo">
          
          <h1 className="logo-title">ShareBite</h1>
          <p className="logo-subtitle">Donate food, feed hope.</p>
        </div>

        {/* Role Tabs */}
        <div className="tabs">
          <button
            className={role === "donor" ? "active" : ""}
            onClick={() => setRole("donor")}
          >
            Donor
          </button>

          <button
            className={role === "ngo" ? "active" : ""}
            onClick={() => setRole("ngo")}
          >
            NGO
          </button>

          <button
            className={role === "acceptor" ? "active" : ""}
            onClick={() => setRole("acceptor")}
          >
            Acceptor
          </button>
        </div>

        {/* Title */}
        <h2 className="title">Create your Account</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form">

          <label>Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <label>Email or Phone</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <label>Location</label>
          <input
            type="text"
            placeholder="City, State"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />

          <button className="register-btn">Register</button>
        </form>
      </div>
    </div>
  );
}
