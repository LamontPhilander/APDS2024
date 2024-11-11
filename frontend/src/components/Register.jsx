import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    accountNumber: "",
    idNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const updateForm = (field, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic validation
    if (
      !form.fullName ||
      !form.accountNumber ||
      !form.idNumber ||
      !form.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:3001/api/auth/register",
        form
      );
      // Redirect to login page if registration is successful
      navigate("/login");

      if (response.status === 200) {
        setSuccess(true);
        setForm({
          fullName: "",
          idNumber: "",
          accountNumber: "",
          password: "",
        });
      }
    } catch (error) {
      console.error("Error registering customer:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Customer Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={form.fullName}
            onChange={(e) => updateForm("fullName", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="accountNumber">Account Number</label>
          <input
            type="text"
            id="accountNumber"
            value={form.accountNumber}
            onChange={(e) => updateForm("accountNumber", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="idNumber">ID Number</label>
          <input
            type="text"
            id="idNumber"
            value={form.idNumber}
            onChange={(e) => updateForm("idNumber", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={(e) => updateForm("password", e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
        {success && (
          <p className="success">Registration successful! Please log in.</p>
        )}
      </form>
    </div>
  );
};

export default Register;
