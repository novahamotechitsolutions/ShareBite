import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Country list
  const countryList = [
    { flag: "in", code: "+91", name: "India" },
    { flag: "us", code: "+1", name: "United States" },
    { flag: "gb", code: "+44", name: "United Kingdom" },
    { flag: "au", code: "+61", name: "Australia" },
    { flag: "ae", code: "+971", name: "UAE" },
    { flag: "ca", code: "+1", name: "Canada" },
    { flag: "de", code: "+49", name: "Germany" },
    { flag: "fr", code: "+33", name: "France" },
    { flag: "sg", code: "+65", name: "Singapore" },
    { flag: "nz", code: "+64", name: "New Zealand" },
    { flag: "za", code: "+27", name: "South Africa" },
    { flag: "br", code: "+55", name: "Brazil" },
    { flag: "jp", code: "+81", name: "Japan" },
    { flag: "kr", code: "+82", name: "South Korea" },
  ];

  const selectedCountry = countryList.find((c) => c.code === countryCode);

  // SEND OTP
  const sendOtp = () => {
    if (!phone || phone.length < 6) {
      alert("Enter valid phone number");
      return;
    }
    setOtpSent(true);
    alert("OTP sent to " + countryCode + phone);
  };

  // VERIFY OTP + REDIRECT BASED ON ROLE
  const verifyOtp = () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Enter a 6-digit OTP");
      return;
    }

    alert("OTP verified!");

    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));
    localStorage.setItem("loggedInUser", JSON.stringify(savedUser));

    // 🔥 ROLE-BASED NAVIGATION
    if (savedUser.role === "ngo") {
      navigate("/ngo-dashboard");
    } else if (savedUser.role === "acceptor") {
      navigate("/acceptor-dashboard");
    } else {
      navigate("/donor-dashboard");
    }
  };

  // EMAIL LOGIN (same fix)
const handleLogin = (e) => {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

  const savedUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!savedUser) {
    alert("Invalid email or password.");
    return;
  }

  alert("Login successful!");
  localStorage.setItem("loggedInUser", JSON.stringify(savedUser));

  // Redirect by role
  if (savedUser.role === "ngo") {
    navigate("/ngo-dashboard");
  } else if (savedUser.role === "acceptor") {
    navigate("/acceptor-dashboard");
  } else {
    navigate("/donor-dashboard");
  }
};


  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="logo-title">ShareBite</h1>
        <p className="logo-subtitle">Donate food, feed hope.</p>
        <h2 className="login-title">Welcome Back</h2>

        <form className="login-form" onSubmit={handleLogin}>

          {/* EMAIL */}
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* PHONE NUMBER WITH FLAG DROPDOWN */}
          <label>Phone Number</label>

          <div className="phone-row">
            <div
              className="country-dropdown-box"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={`https://flagcdn.com/24x18/${selectedCountry.flag}.png`}
                className="flag-icon"
              />
              <span>{selectedCountry.code}</span>
              <span>▼</span>
            </div>

            {dropdownOpen && (
              <div className="dropdown-list">
                {countryList.map((c) => (
                  <div
                    key={c.code}
                    className="dropdown-item"
                    onClick={() => {
                      setCountryCode(c.code);
                      setDropdownOpen(false);
                    }}
                  >
                    <img
                      src={`https://flagcdn.com/24x18/${c.flag}.png`}
                      className="flag-icon"
                    />
                    <span>{c.name}</span>
                    <span>({c.code})</span>
                  </div>
                ))}
              </div>
            )}

            <input
              type="text"
              className="phone-input"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button type="button" className="verify-btn" onClick={sendOtp}>
              Send OTP
            </button>
          </div>

          {/* OTP INPUT */}
          {otpSent && (
            <div className="otp-section">
              <label>Enter 6-digit OTP</label>

              <div className="otp-boxes">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    maxLength={1}
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                  />
                ))}
              </div>

              <button type="button" className="login-btn" onClick={verifyOtp}>
                Verify OTP & Login
              </button>
            </div>
          )}

          <button type="submit" className="login-btn">
            Login with Password
          </button>

          <div className="login-footer">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </div>

        </form>
      </div>
    </div>
  );
}
