import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentsPortal = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifiedTransactions, setVerifiedTransactions] = useState(new Set());

  useEffect(() => {
    // Fetch employee transactions
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

  // Toggle verification of a transaction
  const handleVerify = (transactionId) => {
    setVerifiedTransactions((prevVerified) => {
      const newVerified = new Set(prevVerified);
      if (newVerified.has(transactionId)) {
        newVerified.delete(transactionId);
      } else {
        newVerified.add(transactionId);
      }
      return newVerified;
    });
  };

  // Submit verified transactions to SWIFT
  const handleSubmitToSwift = async () => {
    const verifiedArray = Array.from(verifiedTransactions);
    try {
      await axios.post(
        "https://localhost:3001/api/employee/submit-swift",
        { transactions: verifiedArray },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Verified transactions submitted to SWIFT successfully!");
      setVerifiedTransactions(new Set());
    } catch (err) {
      console.error("Error submitting to SWIFT:", err);
      setError("Error submitting to SWIFT");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (transactions.length === 0) return <div>No payments available.</div>;

  return (
    <div className="payments-portal">
      <h2>Payments Portal</h2>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Sender Account</th>
            <th>Receiver Account</th>
            <th>SWIFT Code</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Verify</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.amount}</td>
              <td>{transaction.currency}</td>
              <td>{transaction.senderAccount}</td>
              <td>{transaction.receiverAccount}</td>
              <td>{transaction.receiverSWIFTCode}</td>
              <td>{transaction.status}</td>
              <td>{transaction.customerId || "N/A"}</td>
              <td>
                <button
                  onClick={() => handleVerify(transaction._id)}
                  style={{
                    backgroundColor: verifiedTransactions.has(transaction._id)
                      ? "green"
                      : "gray",
                  }}
                >
                  {verifiedTransactions.has(transaction._id)
                    ? "Verified"
                    : "Verify"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {verifiedTransactions.size > 0 && (
        <button onClick={handleSubmitToSwift} style={{ marginTop: "20px" }}>
          Submit to SWIFT
        </button>
      )}
    </div>
  );
};

export default PaymentsPortal;
