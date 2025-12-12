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

  // 🔐 Money Modal State
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [moneyForm, setMoneyForm] = useState({
    donorName: "",
    mobile: "",
    amount: "",
    upi: "",
  });

  // Redirect if no login
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(loggedInUser);
    }
  }, []);

  // Donation Form Submit
  function handleSubmit(e) {
    e.preventDefault();
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  // Open Money Modal
  function openMoneyModal() {
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setMoneyForm({
      ...moneyForm,
      donorName: savedUser?.name || "",
    });
    setShowMoneyModal(true);
  }

  return (
    <div className="dashboard-container">

      {/* NAVBAR */}
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
          <button className="donate-btn" onClick={openMoneyModal}>
            Donate Money
          </button>

          <span className="bell-icon">🔔</span>

          <div className="profile-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* PAGE TITLE */}
      <h2 className="dashboard-title">Donor Dashboard</h2>

      <div className="donation-card">

        <h3 className="section-title">Create a New Donation</h3>

        {/* TABS */}
        <div className="source-tabs">
          {["Restaurant", "Catering", "Hostel", "Retailer", "Households", "Others"].map(source => (
            <button
              key={source}
              className={`tab-btn ${activeSource === source ? "active" : ""}`}
              onClick={() => setActiveSource(source)}
            >
              {source}
            </button>
          ))}
        </div>

        {/* DONATION FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>🍽 Food Type</label>
              <input
                type="text"
                placeholder="biryani, dal rice"
                value={form.foodType}
                onChange={(e) => setForm({ ...form, foodType: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>📦 Quantity</label>
              <input
                type="text"
                placeholder="10 meals"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </div>
          </div>

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
                placeholder="nagaram, ecil"
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
              onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
            />
          </div>

          <button className="submit-btn">Submit Donation</button>
        </form>
      </div>

      {/* SUCCESS TOAST */}
      {showSuccess && (
        <div className="toast-success">
          <strong>Submission Successful!</strong>
          <p>Your donation has been listed. An NGO will be notified.</p>
        </div>
      )}

      {/* MONEY CONTRIBUTION MODAL */}
      {showMoneyModal && (
        <div className="modal-overlay">
          <div className="money-modal">

            <button className="modal-close" onClick={() => setShowMoneyModal(false)}>
              ✖
            </button>

            <h2 className="modal-title">Donate Money</h2>
            <p className="modal-subtitle">
              Your monetary donations help us cover operational costs and reach more people.
            </p>

            <form className="modal-form">

              <label>👤 Donor Name</label>
              <input
                type="text"
                value={moneyForm.donorName}
                onChange={(e) => setMoneyForm({ ...moneyForm, donorName: e.target.value })}
                required
              />

              <label>📞 Mobile Number</label>
              <input
                type="text"
                placeholder="+1 234 567 890"
                value={moneyForm.mobile}
                onChange={(e) => setMoneyForm({ ...moneyForm, mobile: e.target.value })}
                required
              />

              <label>💵 Amount ($)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={moneyForm.amount}
                onChange={(e) => setMoneyForm({ ...moneyForm, amount: e.target.value })}
                required
              />

              <label>📱 To App Mobile Number</label>
              <input
                type="text"
                placeholder="ShareBite UPI / Mobile"
                value={moneyForm.upi}
                onChange={(e) => setMoneyForm({ ...moneyForm, upi: e.target.value })}
                required
              />

              <button
                className="confirm-btn"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Contribution Submitted Successfully!");
                  setShowMoneyModal(false);
                }}
              >
                Confirm Donation
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
