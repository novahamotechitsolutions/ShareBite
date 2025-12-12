import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("donor");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputsRef = useRef([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phone: "",
    countryCode: "+91",
  });

  const countryList = [
    { flag: "in", code: "+91", name: "India" },
    { flag: "us", code: "+1", name: "United States" },
    { flag: "gb", code: "+44", name: "United Kingdom" },
    { flag: "ca", code: "+1", name: "Canada" },
    { flag: "au", code: "+61", name: "Australia" },
    { flag: "sg", code: "+65", name: "Singapore" },
    { flag: "ae", code: "+971", name: "UAE" },
    { flag: "nz", code: "+64", name: "New Zealand" },
    { flag: "za", code: "+27", name: "South Africa" },
    { flag: "de", code: "+49", name: "Germany" },
    { flag: "fr", code: "+33", name: "France" },
    { flag: "br", code: "+55", name: "Brazil" },
    { flag: "jp", code: "+81", name: "Japan" },
    { flag: "kr", code: "+82", name: "South Korea" },
    { flag: "it", code: "+39", name: "Italy" },
    { flag: "es", code: "+34", name: "Spain" },
    { flag: "mx", code: "+52", name: "Mexico" },
    { flag: "ru", code: "+7", name: "Russia" },
    { flag: "cn", code: "+86", name: "China" },
    { flag: "id", code: "+62", name: "Indonesia" },
    { flag: "np", code: "+977", name: "Nepal" },
    { flag: "bd", code: "+880", name: "Bangladesh" },
    { flag: "lk", code: "+94", name: "Sri Lanka" },
    { flag: "sa", code: "+966", name: "Saudi Arabia" },
    { flag: "om", code: "+968", name: "Oman" },
    { flag: "kw", code: "+965", name: "Kuwait" },
    { flag: "qa", code: "+974", name: "Qatar" },
    { flag: "ph", code: "+63", name: "Philippines" },
    { flag: "th", code: "+66", name: "Thailand" },
    { flag: "tr", code: "+90", name: "Turkey" },
  ];

  const selectedCountry =
    countryList.find((c) => c.code === form.countryCode) || countryList[0];

  const sendOtp = () => {
    if (!form.phone || form.phone.trim().length < 6) {
      alert("Enter a valid phone number.");
      return;
    }
    setOtp(["", "", "", "", "", ""]);
    setOtpSent(true);
    setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
    alert(`Simulated: OTP sent to ${form.countryCode} ${form.phone}`);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^[0-9]?$/.test(val)) return;
    const nextOtp = [...otp];
    nextOtp[idx] = val;
    setOtp(nextOtp);

    if (val && idx < 5) otpInputsRef.current[idx + 1]?.focus();
  };

  const verifyOtpAndRegister = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      alert("Enter 6-digit OTP.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const exists = users.find((u) => u.email === form.email);
    if (exists) {
      alert("Email already registered. Please login.");
      return;
    }

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
      location: form.location,
      phone: `${form.countryCode} ${form.phone}`,
      role,
    };

    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    alert("Signup successful! Please login.");
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      alert("Please send OTP and verify before registering.");
      return;
    }
    if (otp.join("").length === 6) verifyOtpAndRegister();
    else alert("Enter the 6-digit OTP to finish registration.");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="logo-title">ShareBite</h1>
        <p className="logo-subtitle">Donate food, feed hope.</p>

        <div className="tabs">
          <button
            type="button"
            className={role === "donor" ? "active" : ""}
            onClick={() => setRole("donor")}
          >
            Donor
          </button>
          <button
            type="button"
            className={role === "ngo" ? "active" : ""}
            onClick={() => setRole("ngo")}
          >
            NGO
          </button>
          <button
            type="button"
            className={role === "acceptor" ? "active" : ""}
            onClick={() => setRole("acceptor")}
          >
            Acceptor
          </button>
        </div>

        <h2 className="title">Create your Account</h2>

        <form className="form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <label>Email</label>
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

          <label>Phone Number</label>
          <div className="phone-row">
            <div
              className="country-dropdown-box"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={`https://flagcdn.com/24x18/${selectedCountry.flag}.png`}
                className="flag-icon"
                alt=""
              />
              <span>{selectedCountry.code}</span>
              <span>▾</span>
            </div>

            {dropdownOpen && (
              <div className="dropdown-list">
                {countryList.map((c) => (
                  <div
                    key={c.code}
                    className="dropdown-item"
                    onClick={() => {
                      setForm({ ...form, countryCode: c.code });
                      setDropdownOpen(false);
                    }}
                  >
                    <img
                      src={`https://flagcdn.com/24x18/${c.flag}.png`}
                      className="flag-icon"
                      alt=""
                    />
                    <span>{c.name}</span> <span>({c.code})</span>
                  </div>
                ))}
              </div>
            )}

            <input
              type="text"
              className="phone-input"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />

            <button type="button" className="verify-btn" onClick={sendOtp}>
              Send OTP
            </button>
          </div>

          {otpSent && (
            <div className="otp-section">
              <label>Enter 6-digit OTP</label>
              <div className="otp-boxes">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    ref={(el) => (otpInputsRef.current[i] = el)}
                    className="otp-input"
                    value={d}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                  />
                ))}
              </div>

              <button type="button" className="register-btn" onClick={verifyOtpAndRegister}>
                Verify & Register
              </button>
            </div>
          )}

          {!otpSent && (
            <button className="register-btn" type="submit">
              Register (Verify required)
            </button>
          )}
        </form>

        {/* ⭐ ADDED FOOTER BELOW SIGNUP ⭐ */}
        <div className="signup-footer">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
}
