import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import { useState } from "react";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    // Call the onLogout prop function to clear auth state
    onLogout();
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Banking App
        </Link>

        <div className="navbar-links">
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/payment">Make Payment</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
