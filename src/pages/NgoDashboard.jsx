import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NgoDashboard.css";

export default function NgoDashboard() {
  const [user, setUser] = useState(null);
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [moneyForm, setMoneyForm] = useState({
    donorName: "",
    amount: "",
  });

  const [uploadedImages, setUploadedImages] = useState([]);

  const navigate = useNavigate();

  // ================================
  // INITIAL LOAD & ROLE PROTECTION
  // ================================
  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedIn) {
      navigate("/login");
      return;
    }

    if (loggedIn.role !== "ngo") {
      alert("Access denied! Only NGO users can open this page.");
      navigate("/login");
      return;
    }

    setUser(loggedIn);
    setProfileForm({
      name: loggedIn.name,
      email: loggedIn.email,
      phone: loggedIn.phone || "",
    });

    // Load previously uploaded images
    const savedImgs =
      JSON.parse(localStorage.getItem("ngo_uploaded_images")) || [];
    setUploadedImages(savedImgs);
  }, [navigate]);

  // ================================
  // PROFILE MODAL
  // ================================
  function openProfileModal() {
    setProfileForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
    setShowProfileModal(true);
  }

  function saveProfile(e) {
    e.preventDefault();

    const updatedUser = { ...user, ...profileForm };
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    users = users.map((u) =>
      u.email === user.email ? updatedUser : u
    );
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    setUser(updatedUser);
    alert("Profile updated successfully!");
    setShowProfileModal(false);
  }

  // ================================
  // MONEY MODAL
  // ================================
  function openMoneyModal() {
    setMoneyForm({
      donorName: user?.name || "",
      amount: "",
    });
    setShowMoneyModal(true);
  }

  // ================================
  // UPLOAD IMAGES
  // ================================
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

  // ================================
  // LOGOUT
  // ================================
  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  // ================================
  // DUMMY PICKUP REQUEST DATA
  // ================================
  const requests = [
    {
      source: "Households",
      category: "Groceries",
      meals: 5,
      address: "456 Hitech City Main Rd, Madhapur, Hyderabad",
      distance: "1.1km",
    },
    {
      source: "Retailer",
      category: "Canned Goods",
      meals: 50,
      address: "Gachibowli ORR, Hyderabad",
      distance: "5.8km",
    },
    {
      source: "Catering",
      category: "Event Leftovers",
      meals: 25,
      address: "101 Banjara Hills, Hyderabad",
      distance: "3.5km",
    },
  ];

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
          <button className="donate-btn" onClick={openMoneyModal}>
            Donate Money
          </button>

          <span className="bell-icon">🔔</span>

          {/* Profile Modal Trigger */}
          <div className="profile-circle thick" onClick={openProfileModal}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="ngo-title">NGO Dashboard</h2>
      <p className="ngo-subtitle">Active Pickup Requests</p>

      {/* PICKUP REQUEST CARDS */}
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
        <p>Showcase your impact by uploading photos of food distribution.</p>

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
          {uploadedImages.length === 0 && <p>No images uploaded yet.</p>}

          {uploadedImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="uploaded"
              className="preview-img"
            />
          ))}
        </div>
      </div>

      {/* ================================
          PROFILE MODAL
      ================================ */}
      {/* ---------------- PROFILE MODAL ---------------- */}
{showProfileModal && (
  <div className="modal-overlay">
    <div className="profile-modal">

      {/* TOP-LEFT CANCEL CROSS */}
      <button
        className="modal-cancel-left"
        onClick={() => setShowProfileModal(false)}
      >
        ✖
      </button>

      {/* TOP-RIGHT CANCEL CROSS (optional, keep or remove) */}
      <button
        className="modal-close"
        onClick={() => setShowProfileModal(false)}
      >
        ✖
      </button>

      <h2>Edit Profile</h2>

      <form onSubmit={saveProfile}>
        <label>Name</label>
        <input
          type="text"
          value={profileForm.name}
          onChange={(e) =>
            setProfileForm({ ...profileForm, name: e.target.value })
          }
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={profileForm.email}
          onChange={(e) =>
            setProfileForm({ ...profileForm, email: e.target.value })
          }
          required
        />

        <label>Phone Number</label>
        <input
          type="text"
          value={profileForm.phone}
          onChange={(e) =>
            setProfileForm({ ...profileForm, phone: e.target.value })
          }
        />

        <button className="save-btn">Save Changes</button>
      </form>

    </div>
  </div>
)}

      {/* ================================
          MONEY MODAL (QR CODE)
      ================================ */}
      {showMoneyModal && (
        <div className="modal-overlay">
          <div className="money-modal">
            <button
              className="modal-close"
              onClick={() => setShowMoneyModal(false)}
            >
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
