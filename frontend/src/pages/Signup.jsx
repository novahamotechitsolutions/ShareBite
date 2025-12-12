import React, { useState, useEffect, useContext } from "react";
import "./Signup.css";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function BasketIllustrationSmall({ width = 120 }) {
  return (
    <svg width={width} viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g transform="translate(6,6)">
        <ellipse cx="110" cy="140" rx="60" ry="12" fill="#f2e6d3" />
        <rect x="20" y="18" width="180" height="96" rx="12" fill="#fff7ed" stroke="#efd8b8" />
        <rect x="42" y="28" width="46" height="36" rx="6" fill="#dff0d9" />
        <rect x="104" y="28" width="42" height="40" rx="6" fill="#ffd8b0" />
      </g>
    </svg>
  );
}

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("donor");
  const [location, setLocation] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let i;
    if (timer > 0) i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  function redirectByRole(r) {
    if (r === "donor") navigate("/donor-dashboard");
    else if (r === "ngo") navigate("/ngo-dashboard");
    else navigate("/acceptor-dashboard");
  }

  async function requestOtp(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/register-request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, location }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to request OTP");
      setOtpRequested(true);
      setTimer(60);
      setMessage("OTP sent to your email — check inbox & spam.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/register-verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, location, role, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      login(data.token, data.user);
      setMessage("Registration successful — redirecting...");
      redirectByRole(data.user.role);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center" style={{ justifyContent: "center" }}>
      {/* Left card (preview login) */}
      <div className="card" style={{ width: 420, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div>
          <div className="brand-title">Share Bites</div>
          <div className="brand-sub">Donate Food, Feed Hope</div>
        </div>
        <div style={{ marginTop: 6 }}>
          <BasketIllustrationSmall width={160} />
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ textAlign: "center", fontWeight: 700, color: "#2f6b3a" }}>Log In</div>
          <div style={{ marginTop: 10 }}>
            <button className="btn-main" onClick={() => navigate("/login")}>Go to Login</button>
          </div>
        </div>
      </div>

      {/* Main signup card */}
      <div className="card" style={{ maxWidth: 520 }}>
        <div style={{ textAlign: "center" }}>
          <div className="brand-title">Share Bites</div>
          <div className="brand-sub">Donate Food, Feed Hope</div>
        </div>

        <div className="role-pills" style={{ marginTop: 14 }}>
          {["donor", "ngo", "acceptor"].map((r) => (
            <button key={r} className={`role-pill ${role === r ? "active" : ""}`} onClick={() => setRole(r)}>{r.charAt(0).toUpperCase() + r.slice(1)}</button>
          ))}
        </div>

        <h3 className="section-title">Create Account</h3>

        {!otpRequested ? (
          <form onSubmit={requestOtp} className="form">
            <label>Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />

            <label>Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Location</label>
            <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />

            <div className="cta">
              <button className="btn-main" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
            </div>

            {message && <p className="msg">{message}</p>}
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="form">
            <label>Enter OTP</label>
            <input className="input" value={otp} onChange={(e) => setOtp(e.target.value)} required />

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="btn-main" style={{ flex: 1 }} disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
              <button className="resend-btn" type="button" onClick={requestOtp} disabled={timer > 0}>{timer > 0 ? `Resend ${timer}s` : "Resend"}</button>
            </div>

            {message && <p className="msg">{message}</p>}
          </form>
        )}

        <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
          <button className="btn-alt" onClick={() => navigate("/login")} style={{ width: 200 }}>Already have account? Login</button>
        </div>
      </div>
    </div>
  );
}



