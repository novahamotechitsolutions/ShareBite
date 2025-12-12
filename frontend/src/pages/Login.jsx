import React, { useState, useEffect, useContext } from "react";
import "./Login.css";
import { useAuth } from "../auth/AuthContext"; // use the hook we added earlier
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/* Inline basket SVG illustration component (left card look) */
function BasketIllustration({ width = 220 }) {
  return (
    <svg width={width} viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect rx="12" width="100%" height="100%" fill="none" />
      <g transform="translate(10,10)">
        <ellipse cx="150" cy="190" rx="90" ry="20" fill="#f2e6d3" />
        <rect x="40" y="50" width="220" height="120" rx="18" fill="#f8efe3" stroke="#efd8b8" />
        <rect x="68" y="70" width="60" height="40" rx="8" fill="#dff0d9" />
        <rect x="140" y="70" width="46" height="46" rx="6" fill="#ffe8c9" />
        <circle cx="200" cy="100" r="20" fill="#ffb88c" />
        <rect x="90" y="110" width="120" height="36" rx="8" fill="#fff7e6" />
      </g>
    </svg>
  );
}

/* Inline person-with-box SVG illustration component */
function DonatePersonIllustration({ width = 160 }) {
  return (
    <svg width={width} viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g transform="translate(0,6)">
        <rect x="0" y="0" width="200" height="220" rx="12" fill="none" />
        <circle cx="100" cy="48" r="30" fill="#f7d9c5" />
        <rect x="58" y="86" width="84" height="86" rx="18" fill="#e9f8ed" />
        <rect x="60" y="146" width="80" height="36" rx="8" fill="#ffd6a6" />
        <rect x="72" y="160" width="56" height="14" rx="4" fill="#fef3e6" />
      </g>
    </svg>
  );
}

export default function Login() {
  console.log("API_BASE =", API_BASE);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("donor");
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
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
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
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP invalid");
      login(data.token, data.user);
      setMessage("Login successful — redirecting...");
      redirectByRole(data.user.role);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center" style={{ justifyContent: "center" }}>
      <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <BasketIllustration width={160} />
          <div>
            <div className="brand-title">Share Bites</div>
            <div className="brand-sub">Donate Food, Feed Hope</div>
          </div>
        </div>

        <div className="role-pills" style={{ marginTop: 20 }}>
          {["donor", "ngo", "acceptor"].map((r) => (
            <button
              key={r}
              type="button"
              className={`role-pill ${role === r ? "active" : ""}`}
              onClick={() => setRole(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <h3 className="section-title" style={{ marginTop: 6 }}>Log In</h3>

        {!otpRequested ? (
          <form onSubmit={requestOtp} className="form" style={{ width: "100%", padding: "0 20px" }}>
            <label>Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

            <div className="cta">
              <button className="btn-main" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
            </div>

            {message && <p className="msg" style={{ textAlign: "center" }}>{message}</p>}
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="form" style={{ width: "100%", padding: "0 20px" }}>
            <label>Enter OTP</label>
            <input className="input" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} />

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="btn-main" style={{ flex: 1 }} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button type="button" className="resend-btn" onClick={requestOtp} disabled={timer > 0}>
                {timer > 0 ? `Resend ${timer}s` : "Resend"}
              </button>
            </div>

            {message && <p className="msg" style={{ textAlign: "center" }}>{message}</p>}
          </form>
        )}

        {/* Signup CTA */}
        <div className="cta" style={{ marginTop: 18 }}>
          <button className="btn-alt" onClick={() => navigate("/signup")} style={{ width: 240 }}>
            Create Account
          </button>
        </div>
      </div>

      {/* Signup card preview on the right (small) */}
      <div className="card" style={{ width: 420, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="brand-title">Share Bites</div>
          <div className="brand-sub">Donate Food, Feed Hope</div>
        </div>

        <div style={{ marginTop: 8 }}>
          <DonatePersonIllustration width={200} />
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ textAlign: "center", fontWeight: 700, color: "#d8682b" }}>Create Account</div>
          <div style={{ marginTop: 12 }}>
            <button className="btn-main" style={{ background: "#d8682b", width: 200 }} onClick={() => navigate("/signup")}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

