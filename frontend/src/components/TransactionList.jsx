import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3001/api/transactions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTransactions(response.data);
      } catch (err) {
        setError("Failed to load transactions.");
      }
    };

    fetchTransactions();
  }, []);

  const handleVerify = async (transactionId) => {
    try {
      await axios.put(
        `https://localhost:3001/api/verify/${transactionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Update the transaction status locally
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === transactionId
            ? { ...transaction, verified: true }
            : transaction
        )
      );
    } catch (err) {
      setError("Failed to verify transaction.");
    }
  };

  const handleSubmitToSWIFT = async () => {
    try {
      await axios.put(
        "https://localhost:3001/api/submit-to-swift",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Transactions successfully submitted to SWIFT");
    } catch (err) {
      setError("Failed to submit transactions to SWIFT.");
    }
  };

  return (
    <div>
      <h2>Transactions Awaiting Verification</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Payee Account</th>
            <th>SWIFT Code</th>
            <th>Verified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.amount}</td>
              <td>{transaction.receiverAccount}</td>
              <td>{transaction.receiverSWIFTCode}</td>
              <td>{transaction.verified ? "Verified" : "Pending"}</td>
              <td>
                {!transaction.verified && (
                  <button onClick={() => handleVerify(transaction._id)}>
                    Verify
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmitToSWIFT}>Submit to SWIFT</button>
    </div>
  );
};

export default TransactionList;
