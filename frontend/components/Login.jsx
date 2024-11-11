import "./App.css";

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    name: "",
    accountNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
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
      const response = await axios.post(
        "https://localhost:3001/api/auth/login",
        form,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Save the JWT token to localStorage
      const { token } = response.data;
      localStorage.setItem("token", token);

      // Redirect to a protected page, e.g., dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials, please try again");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
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
