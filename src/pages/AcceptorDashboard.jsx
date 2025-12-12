import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AcceptorDashboard.css";

export default function AcceptorDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // --------------------- Request Meals ---------------------
  const [requestForm, setRequestForm] = useState({
    phone: "",
    meals: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // --------------------- Editable Profile ---------------------
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
  const [changeType, setChangeType] = useState("");

  // --------------------- Country List ---------------------
  const countryList = [
    { flag: "in", code: "+91", name: "India" },
    { flag: "us", code: "+1", name: "United States" },
    { flag: "gb", code: "+44", name: "United Kingdom" },
    { flag: "sg", code: "+65", name: "Singapore" },
    { flag: "au", code: "+61", name: "Australia" },
    { flag: "ca", code: "+1", name: "Canada" },
    { flag: "ae", code: "+971", name: "UAE" },
  ];

  const selectedCountry =
    countryList.find((c) => c.code === profileForm.countryCode) || countryList[0];

  // --------------------- Money Modal ---------------------
  const [showMoneyModal, setShowMoneyModal] = useState(false);

  // --------------------- Load User ---------------------f
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    if (loggedInUser.role !== "acceptor") {
      alert("Access denied! Only Acceptor users can open this page.");
      navigate("/login");
      return;
    }

    setUser(loggedInUser);
    const [first, ...rest] = loggedInUser.name.split(" ");

    setProfileForm({
      firstName: first,
      lastName: rest.join(" "),
      email: loggedInUser.email,
      phone: loggedInUser.phone,
      countryCode: loggedInUser.countryCode || "+91",
    });

    setRequestForm({
      phone: loggedInUser.phone,
      meals: "",
    });
  }, []);

  // --------------------- Submit Meal Request ---------------------
  function submitRequest(e) {
    e.preventDefault();
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);
  }

  // --------------------- Logout ---------------------
  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  // --------------------- Open Profile Modal ---------------------
  function openProfile() {
    setShowProfileModal(true);
  }

  // --------------------- Request Profile Update ---------------------
  function requestProfileUpdate(e) {
    e.preventDefault();

    let newName = profileForm.firstName + " " + profileForm.lastName;

    if (newName !== user.name || profileForm.email !== user.email) {
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

  // --------------------- OTP Logic ---------------------
  function handleOtpChange(value, index) {
    if (!/^[0-9]?$/.test(value)) return;

    const arr = [...otp];
    arr[index] = value;
    setOtp(arr);
  }

  function verifyOtp() {
    const value = otp.join("");

    if (value.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    let updatedUser = {
      ...user,
      name: profileForm.firstName + " " + profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
      countryCode: profileForm.countryCode,
    };

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    users = users.map((u) =>
      u.email === user.email ? updatedUser : u
    );
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    setUser(updatedUser);
    alert("Profile Updated Successfully!");

    setShowOtpModal(false);
    setShowProfileModal(false);
  }

  return (
    <div className="acceptor-container">

      {/* --------------------- NAVBAR --------------------- */}
      <div className="navbar">
        <div className="nav-left">
          <img
            src="https://cdn-icons-png.flaticon.com/512/10470/10470439.png"
            alt="logo"
            className="logo-img"
          />
          <h1 className="nav-title">ShareBite</h1>
        </div>

        <div className="nav-right">
          <button className="donate-btn" onClick={() => setShowMoneyModal(true)}>
            Donate Money
          </button>

          <span className="bell-icon">🔔</span>

          <div className="profile-circle thick" onClick={openProfile}>
            {user?.name.charAt(0).toUpperCase()}
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* --------------------- PAGE TITLE --------------------- */}
      <h2 className="dashboard-title">Acceptor Dashboard</h2>

      {/* --------------------- REQUEST CARD --------------------- */}
      <div className="request-card">
        <h3>Request Meals</h3>
        <p>Let us know your needs, and we will connect you with an NGO.</p>

        <form onSubmit={submitRequest}>
          <label>📞 Mobile Number</label>
          <input
            type="text"
            value={requestForm.phone}
            onChange={(e) =>
              setRequestForm({ ...requestForm, phone: e.target.value })
            }
            required
          />

          <label>🍽 Meals Needed</label>
          <input
            type="number"
            value={requestForm.meals}
            onChange={(e) =>
              setRequestForm({ ...requestForm, meals: e.target.value })
            }
            required
          />

          <button className="submit-btn">Submit Request</button>
        </form>
      </div>

      {/* --------------------- SUCCESS BANNER --------------------- */}
      {showSuccess && (
        <div className="toast-success">
          <strong>Request Submitted!</strong>
          <p>NGO has been notified.</p>
        </div>
      )}

      {/* --------------------- PROFILE EDIT MODAL --------------------- */}
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
                    alt=""
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
                          alt=""
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

      {/* --------------------- OTP MODAL --------------------- */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="otp-modal">
            <button className="modal-close" onClick={() => setShowOtpModal(false)}>
              ✖
            </button>

            <h2>Verify OTP</h2>
            <p>Enter 6-digit OTP sent to your {changeType}</p>

            <div className="otp-boxes">
              {otp.map((digit, i) => (
                <input
                  key={i}
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

      {/* --------------------- MONEY MODAL --------------------- */}
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

            <button
              className="confirm-btn"
              onClick={() => {
                alert("Thank you for your contribution!");
                setShowMoneyModal(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
