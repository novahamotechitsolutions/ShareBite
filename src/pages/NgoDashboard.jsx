import React, { useEffect, useState } from "react";
import "./NgoDashboard.css";

export default function NgoDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(loggedIn);
  }, []);

  // Dummy donation requests (replace with API later)
  const requests = [
    {
      source: "Restaurant",
      category: "Cooked Meals",
      meals: 10,
      address: "Plot 123, Jubilee Hills, Hyderabad, Telangana",
      distance: "2.3km",
    },
    {
      source: "Households",
      category: "Groceries",
      meals: 5,
      address: "456 Hitech City Main Rd, Madhapur, Hyderabad, Telangana",
      distance: "1.1km",
    },
    {
      source: "Retailer",
      category: "Canned Goods",
      meals: 50,
      address:
        "789 Gachibowli Outer Ring Road, Gachibowli, Hyderabad, Telangana",
      distance: "5.8km",
    },
    {
      source: "Catering",
      category: "Event Leftovers",
      meals: 25,
      address: "101 Banjara Hills Rd 1, Masab Tank, Hyderabad, Telangana",
      distance: "3.4km",
    },
  ];

  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
  }

  return (
    <div className="ngo-container">

      {/* TOP NAVBAR */}
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
          <button className="donate-btn">Contribute Money</button>
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
      <h2 className="ngo-title">NGO Dashboard</h2>
      <p className="ngo-subtitle">Active Pickup Requests</p>

      {/* REQUEST CARDS */}
      <div className="cards-grid">
        {requests.map((req, index) => (
          <div className="donation-card" key={index}>
            <h3 className="source-title">{req.source}</h3>
            <p className="category">{req.category}</p>

            <h2 className="meals-text">{req.meals} meals</h2>

            <p className="address">
              📍 {req.address}
            </p>

            <p className="distance">Distance: {req.distance}</p>

            <button className="accept-btn">✔ Accept</button>
          </div>
        ))}
      </div>
    </div>
  );
}
