import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NgoDashboard.css";

export default function NgoDashboard() {
  const navigate = useNavigate();

  // ================= STATES =================
  const [user, setUser] = useState(null);
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [uploadedImages, setUploadedImages] = useState([]);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+91",
  });

  const [moneyForm, setMoneyForm] = useState({
    donorName: "",
    amount: "",
  });

  // OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [changeType, setChangeType] = useState("");

  // Country flags
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const countryList = [
    { flag: "in", code: "+91", name: "India" },
    { flag: "us", code: "+1", name: "USA" },
    { flag: "gb", code: "+44", name: "UK" },
    { flag: "au", code: "+61", name: "Australia" },
    { flag: "ca", code: "+1", name: "Canada" },
    { flag: "sg", code: "+65", name: "Singapore" },
  ];

  const selectedCountry = countryList.find(
    (c) => c.code === profileForm.countryCode
  ) || countryList[0];

  // ================= CHECK LOGIN =================
  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedIn) {
      navigate("/login");
      return;
    }

    if (loggedIn.role !== "ngo") {
      alert("Access denied — Only NGO can open this page");
      navigate("/login");
      return;
    }

    setUser(loggedIn);

    const [first, ...rest] = loggedIn.name.split(" ");

    setProfileForm({
      firstName: first,
      lastName: rest.join(" "),
      email: loggedIn.email,
      phone: loggedIn.phone || "",
      countryCode: loggedIn.countryCode || "+91",
    });

    const savedImgs =
      JSON.parse(localStorage.getItem("ngo_uploaded_images")) || [];
    setUploadedImages(savedImgs);
  }, []);

  // ================= PROFILE — REQUEST UPDATE (Ask OTP) =================
  function requestProfileUpdate(e) {
    e.preventDefault();

    const fullName =
      profileForm.firstName + " " + (profileForm.lastName || "");

    if (fullName !== user.name || profileForm.email !== user.email) {
      setChangeType("phone");
      alert("OTP sent to your phone");
    } else if (profileForm.phone !== user.phone) {
      setChangeType("email");
      alert("OTP sent to your email");
    } else {
      alert("No changes found");
      return;
    }

    setShowOtpModal(true);
  }

  // ================= OTP HANDLING =================
  function handleOtpChange(value, index) {
    if (!/^[0-9]?$/.test(value)) return;

    const newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  }

  function verifyOtp() {
    const value = otp.join("");

    if (value.length !== 6) {
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

    let allUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    allUsers = allUsers.map((u) =>
      u.email === user.email ? updatedUser : u
    );

    localStorage.setItem("registeredUsers", JSON.stringify(allUsers));

    setUser(updatedUser);
    alert("Profile updated successfully!");

    setShowOtpModal(false);
    setShowProfileModal(false);
  }

  // ================= UPLOAD IMAGES =================
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImg = event.target.result;
        const updated = [...uploadedImages, newImg];

        setUploadedImages(updated);
        localStorage.setItem("ngo_uploaded_images", JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    });
  };

  // ================= LOGOUT =================
  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  // ================= Dummy Requests =================
  const requests = [
    {
      source: "Households",
      category: "Groceries",
      meals: 5,
      address: "456 Hitech City, Madhapur",
      distance: "1.1km",
    },
    {
      source: "Retailer",
      category: "Canned Goods",
      meals: 50,
      address: "Gachibowli ORR",
      distance: "5.8km",
    },
  ];

  // ============================================================
  // ======================== UI SECTION =========================
  // ============================================================

  return (
    <div className="ngo-container">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <img
            src="https://cdn-icons-png.flaticon.com/512/10470/10470439.png"
            className="logo-img"
            alt="logo"
          />
          <h1 className="nav-title">ShareBite</h1>
        </div>

        <div className="nav-right">
          <button className="donate-btn" onClick={() => setShowMoneyModal(true)}>
            Donate Money
          </button>

          <span className="bell-icon">🔔</span>

          <div className="profile-circle thick" onClick={() => setShowProfileModal(true)}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN TITLE */}
      <h2 className="ngo-title">NGO Dashboard</h2>
      <p className="ngo-subtitle">Active Pickup Requests</p>

      {/* REQUEST CARDS */}
      <div className="cards-grid">
        {requests.map((req, i) => (
          <div className="donation-card" key={i}>
            <h3 className="source-title">{req.source}</h3>
            <p className="category">{req.category}</p>
            <h2 className="meals-text">{req.meals} meals</h2>
            <p className="address">📍 {req.address}</p>
            <p className="distance">Distance: {req.distance}</p>
            <button className="accept-btn">✔ Accept</button>
          </div>
        ))}
      </div>

      {/* DELIVERY DASHBOARD */}
      <h2 className="ngo-title mt-40">Delivery Dashboard</h2>

      <div className="upload-section">
        <h3>Upload Redistribution Images</h3>
        <p>Upload photos of the food distributed.</p>

        <label className="upload-btn">
          Upload Images
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </label>

        <div className="uploaded-images">
          {uploadedImages.map((img, i) => (
            <img key={i} src={img} className="preview-img" />
          ))}
        </div>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="profile-modal">

            <div className="modal-header">
              <span className="close-x" onClick={() => setShowProfileModal(false)}>
                ✕
              </span>
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

      {/* ================= OTP MODAL ================= */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="otp-modal">
            <button className="modal-close" onClick={() => setShowOtpModal(false)}>
              ✖
            </button>

            <h2>Verify OTP</h2>
            <p>Enter code sent to your {changeType}</p>

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

      {/* ================= MONEY MODAL ================= */}
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

            <button className="confirm-btn" onClick={() => setShowMoneyModal(false)}>
              Confirm Donation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
