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

  // 🔐 Redirect if not logged in — NO AuthContext needed
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/login"); // block access & redirect to login
    }
  }, []);

  // ✔ Handle Donation Submit
  function handleSubmit(e) {
    e.preventDefault();

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }

  // ✔ Logout function (optional but recommended)
  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  return (
    <div className="dashboard-container">

      {/* TOP BAR */}
      <div className="top-bar">
        <h2 className="dashboard-title">Donor Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="donation-card">

        <h3 className="section-title">Create a New Donation</h3>

        {/* Food Source Tabs */}
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

        {/* Donation Form */}
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

      {/* Success Toast */}
      {showSuccess && (
        <div className="toast-success">
          <strong>Submission Successful!</strong>
          <p>Your donation has been listed. An NGO will be notified.</p>
        </div>
      )}
    </div>
  );
}
