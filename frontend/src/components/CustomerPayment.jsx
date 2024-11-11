import React, { useState } from "react";
import axios from "axios";

const CustomerPayment = () => {
  const [form, setForm] = useState({
    amount: "",
    currency: "ZAR", // Default currency
    provider: "SWIFT", // Default provider
    receiverAccount: "",
    receiverSWIFTCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success message

    try {
      const response = await axios.post(
        "https://localhost:3001/api/customer/payment",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Payment processed successfully!");
      setForm({
        amount: "",
        currency: "ZAR",
        provider: "SWIFT",
        receiverAccount: "",
        receiverSWIFTCode: "",
      });
    } catch (err) {
      setError("Error processing payment. Please try again.");
      console.error("Payment error:", err);
    }
  };

  return (
    <div className="payment-container">
      <h2>Make a Payment</h2>
      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={form.amount}
            onChange={(e) => updateForm({ amount: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={form.currency}
            onChange={(e) => updateForm({ currency: e.target.value })}
            required
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ZAR">ZAR</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="provider">Payment Provider</label>
          <select
            id="provider"
            value={form.provider}
            onChange={(e) => updateForm({ provider: e.target.value })}
            required
          >
            <option value="SWIFT">SWIFT</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="receiverAccount">Receiver Account</label>
          <input
            type="text"
            id="receiverAccount"
            value={form.receiverAccount}
            onChange={(e) => updateForm({ receiverAccount: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="receiverSWIFTCode">Receiver SWIFT Code</label>
          <input
            type="text"
            id="receiverSWIFTCode"
            value={form.receiverSWIFTCode}
            onChange={(e) => updateForm({ receiverSWIFTCode: e.target.value })}
            required
          />
        </div>

        <button type="submit">Pay Now</button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default CustomerPayment;
