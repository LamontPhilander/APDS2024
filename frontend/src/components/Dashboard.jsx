import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch customer data on component mount
    const fetchCustomerData = async () => {
      const token = localStorage.getItem("token");
      console.log("JWT Token: ", token);
      if (!token) {
        navigate("/login"); // Redirect to login if no token is found
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(
          "https://localhost:3001/api/customer/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCustomerData(response.data);
      } catch (err) {
        setError("Failed to fetch customer data");
        console.error("Error fetching customer data:", err);
        localStorage.removeItem("token"); // Remove invalid token
        navigate("/login"); // Redirect to login on error
      }
    };

    fetchCustomerData();
  }, [navigate]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!customerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {customerData.fullName}</h2>
      <p>Account Number: {customerData.accountNumber}</p>

      <h3>Recent Transactions</h3>
      {customerData.transactions && customerData.transactions.length > 0 ? (
        <ul>
          {customerData.transactions.map((transaction) => (
            <li key={transaction.id}>
              {transaction.date}: {transaction.amount} {transaction.currency} -{" "}
              {transaction.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent transactions</p>
      )}
    </div>
  );
};

export default Dashboard;
