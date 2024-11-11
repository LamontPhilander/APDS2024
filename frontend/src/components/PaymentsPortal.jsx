import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentsPortal = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the employee transactions
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3001/api/employee/transactions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTransactions(response.data);
      } catch (err) {
        setError("Error fetching transactions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (transactions.length === 0) {
    return <div>No payments available.</div>;
  }

  return (
    <div className="payments-portal">
      <h2>Payments Portal</h2>
      {transactions &&
      Array.isArray(transactions) &&
      transactions.length > 0 ? (
        <ul>
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Currency</th>
                <th>Sender Account</th>
                <th>Receiver Account</th>
                <th>Status</th>
                <th>Customer</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.amount}</td>
                  <td>{transaction.currency}</td>
                  <td>{transaction.senderAccount}</td>
                  <td>{transaction.receiverAccount}</td>
                  <td>{transaction.status}</td>
                  <td>{transaction.customerId.fullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default PaymentsPortal;
