import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DonorDashboard.css";

export default function DonorDashboard() {
  const navigate = useNavigate();

  const [activeSource, setActiveSource] = useState("Restaurant");
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    foodType: "",
    quantity: "",
    expiry: "",
    location: "",
    photo: null,
  });

  const [user, setUser] = useState(null);

  // ---------------- Money Modal ----------------
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [moneyForm, setMoneyForm] = useState({
    donorName: "",
    mobile: "",
    amount: "",
  });

  // ---------------- Profile Modal ----------------
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+91",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Country list
  const countryList = [
    { flag: "in", code: "+91", name: "India" },
    { flag: "us", code: "+1", name: "United States" },
    { flag: "gb", code: "+44", name: "United Kingdom" },
    { flag: "au", code: "+61", name: "Australia" },
    { flag: "ca", code: "+1", name: "Canada" },
    { flag: "ae", code: "+971", name: "UAE" },
    { flag: "fr", code: "+33", name: "France" },
    { flag: "de", code: "+49", name: "Germany" },
    { flag: "sg", code: "+65", name: "Singapore" },
    { flag: "jp", code: "+81", name: "Japan" },
  ];

  const selectedCountry = countryList.find(
    (c) => c.code === profileForm.countryCode
  );

  const [changeType, setChangeType] = useState("");

  // ---------------- Page Load ----------------
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(loggedInUser);

      const [first, ...rest] = loggedInUser.name.split(" ");
      setProfileForm({
        firstName: first,
        lastName: rest.join(" "),
        email: loggedInUser.email,
        phone: loggedInUser.phone || "",
        countryCode: loggedInUser.countryCode || "+91",
      });
    }
  }, []);

  // ---------------- Donation Submit ----------------
  function handleSubmit(e) {
    e.preventDefault();

    let imageBase64 = "";

    if (form.photo) {
      const reader = new FileReader();
      reader.onload = () => {
        imageBase64 = reader.result;
        saveDonation(imageBase64);
      };
      reader.readAsDataURL(form.photo);
    } else {
      saveDonation("");
    }
  }

  function saveDonation(imageBase64) {
    const donation = {
      id: Date.now(),
      source: activeSource,
      foodType: form.foodType,
      category: "Cooked Food",
      meals: form.quantity,
      address: form.location,
      expiry: form.expiry,
      photo: imageBase64,
      distance: "2–5 km",
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("donations_list")) || [];
    existing.push(donation);
    localStorage.setItem("donations_list", JSON.stringify(existing));

    alert("Donation submitted! NGO will be notified.");

    setForm({
      foodType: "",
      quantity: "",
      expiry: "",
      location: "",
      photo: null,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  // ---------------- Logout ----------------
  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  // ---------------- Money Modal ----------------
  function openMoneyModal() {
    setMoneyForm({ donorName: user?.name || "", mobile: "", amount: "" });
    setShowMoneyModal(true);
  }

  // ---------------- Profile Modal ----------------
  function openProfile() {
    setShowProfileModal(true);
  }

  // ---------------- REQUEST UPDATE → OTP ----------------
  function requestProfileUpdate(e) {
    e.preventDefault();

    const fullName = profileForm.firstName + " " + profileForm.lastName;

    if (fullName !== user.name || profileForm.email !== user.email) {
      setChangeType("phone");
      alert("OTP sent to your phone number.");
    } else if (profileForm.phone !== user.phone) {
      setChangeType("email");
      alert("OTP sent to your email.");
    } else {
      alert("No changes detected.");
      return;
    }

    setShowOtpModal(true);
  }

  // ---------------- OTP Logic ----------------
  function handleOtpChange(value, index) {
    if (!/^[0-9]?$/.test(value)) return;

    const arr = [...otp];
    arr[index] = value;
    setOtp(arr);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  }

  function verifyOtp() {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    const updatedUser = {
      ...user,
      name: profileForm.firstName + " " + profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
      countryCode: profileForm.countryCode,
    };

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    users = users.map((u) => (u.email === user.email ? updatedUser : u));
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    setUser(updatedUser);
    alert("Profile Updated Successfully!");

    setShowOtpModal(false);
    setShowProfileModal(false);
  }

  // ---------------- UI ----------------
  return (
    <div className="dashboard-container">

      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <img src="https://cdn-icons-png.flaticon.com/512/10470/10470439.png" className="logo-img" alt="logo" />
          <h1 className="nav-title">ShareBite</h1>
        </div>

        <div className="nav-right">
          <button className="donate-btn" onClick={openMoneyModal}>Donate Money</button>
          <span className="bell-icon">🔔</span>

          <div className="profile-circle" onClick={openProfile}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="dashboard-title">Donor Dashboard</h2>

      {/* DONATION FORM UI (UNCHANGED) */}
      <div className="donation-card">
        <h3 className="section-title">Create a New Donation</h3>

        <div className="source-tabs">
          {["Restaurant", "Catering", "Hostel", "Retailer", "Households", "Others"].map((src) => (
            <button
              key={src}
              className={`tab-btn ${activeSource === src ? "active" : ""}`}
              onClick={() => setActiveSource(src)}
            >
              {src}
            </button>
          ))}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* Food Type + Quantity */}
          <div className="form-row">
            <div className="form-group">
              <label>🍽 Food Type</label>
              <input
                type="text"
                value={form.foodType}
                onChange={(e) => setForm({ ...form, foodType: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>📦 Quantity</label>
              <input
                type="text"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Expiry + Location */}
          <div className="form-row">
            <div className="form-group">
              <label>📅 Expiry</label>
              <input
                type="date"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>📍 Location</label>
              <input
                type="text"
                placeholder="Example: Nagaram, ECIL"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
          </div>

          <h4 className="sub-heading">Food Quality Check</h4>
          <div className="upload-box">
            <label className="upload-label">⬆ Upload Photos</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
              required
            />
          </div>

          <button className="submit-btn">Submit Donation</button>
        </form>
      </div>

      {/* SUCCESS BANNER */}
      {showSuccess && (
        <div className="toast-success">
          <strong>Donation Submitted!</strong>
          <p>NGO has been notified.</p>
        </div>
      )}

      {/* ---------------- PROFILE EDIT MODAL ---------------- */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="profile-modal">

            <div className="modal-header">
              <span className="close-x" onClick={() => setShowProfileModal(false)}>✕</span>
              <span className="edit-title">Edit Profile</span>
            </div>

            <form onSubmit={requestProfileUpdate}>

              <label>First Name</label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, firstName: e.target.value })
                }
              />

              <label>Last Name</label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, lastName: e.target.value })
                }
              />

              <label>Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
              />

              <label>Phone Number</label>
              <div className="phone-row">

                {/* COUNTRY DROPDOWN */}
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
                          setProfileForm({ ...profileForm, countryCode: c.code });
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
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                />
              </div>

              <button className="save-btn">Update</button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- OTP VERIFY MODAL ---------------- */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="otp-modal">
            <button className="modal-close" onClick={() => setShowOtpModal(false)}>✖</button>

            <h2>Verify OTP</h2>
            <p>Enter 6-digit OTP sent to your {changeType}</p>

            <div className="otp-boxes">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                />
              ))}
            </div>

            <button className="confirm-btn" onClick={verifyOtp}>
              Confirm Changes
            </button>
          </div>
        </div>
      )}

      {/* ---------------- MONEY MODAL ---------------- */}
      {showMoneyModal && (
        <div className="modal-overlay">
          <div className="money-modal">
            <button className="modal-close" onClick={() => setShowMoneyModal(false)}>
              ✖
            </button>

            <h2>Donate Money</h2>

            <div className="qr-container">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=sharebite@upi"
                className="qr-image"
                alt="QR"
              />
            </div>

            <label>Your Name</label>
            <input
              type="text"
              value={moneyForm.donorName}
              onChange={(e) =>
                setMoneyForm({ ...moneyForm, donorName: e.target.value })
              }
            />

            <label>Amount</label>
            <input
              type="number"
              value={moneyForm.amount}
              onChange={(e) =>
                setMoneyForm({ ...moneyForm, amount: e.target.value })
              }
            />

            <button
              className="confirm-btn"
              onClick={() => {
                alert("Thank you for your contribution!");
                setShowMoneyModal(false);
              }}
            >
              Confirm Donation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
