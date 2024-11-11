import "../App.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    fullName: "",
    accountNumber: "",
    password: "",
    name: "", // Added for employee login
  });
  const [error, setError] = useState("");
  const [isEmployee, setIsEmployee] = useState(false); // Track whether it's employee login
  const navigate = useNavigate();

  // Update form state
  const updateForm = (value) => {
    setForm((prev) => ({
      ...prev,
      ...value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error messages

    try {
      let url;
      let payload = { ...form };
      if (isEmployee) {
        url = "https://localhost:3001/api/auth/employee/login"; // Employee login API
        delete payload.fullName; // Remove customer-specific field for employees
        delete payload.accountNumber;
      } else {
        url = "https://localhost:3001/api/auth/login"; // Customer login API
      }

      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Save the JWT token to localStorage
      const { token } = response.data;
      localStorage.setItem("token", token);

      // Redirect to the appropriate page
      if (isEmployee) {
        navigate("/payments");
      } else {
        navigate("/payment");
      }
    } catch (err) {
      setError("Invalid credentials, please try again");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div>
        <label>
          <input
            type="radio"
            name="loginType"
            checked={!isEmployee}
            onChange={() => setIsEmployee(false)}
          />
          Customer Login
        </label>
        <label>
          <input
            type="radio"
            name="loginType"
            checked={isEmployee}
            onChange={() => setIsEmployee(true)}
          />
          Employee Login
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        {isEmployee ? (
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              required
            />
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="fullName">Name</label>
              <input
                type="text"
                id="fullName"
                value={form.fullName}
                onChange={(e) => updateForm({ fullName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="accountNumber">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                value={form.accountNumber}
                onChange={(e) => updateForm({ accountNumber: e.target.value })}
                required
              />
            </div>
          </>
        )}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={(e) => updateForm({ password: e.target.value })}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
