import express from 'express';
import jwt from 'jsonwebtoken';
import Transaction from '../models/Transaction.mjs';  // Assuming Transaction model is defined

const router = express.Router();

// Middleware to verify token and role
const authMiddleware = (roles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!roles.includes(decoded.role)) return res.status(403).json({ error: 'Access denied' });
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Employee-only route to view and verify transactions
router.get('/', authMiddleware(['employee']), async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'Pending' });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Route to mark a transaction as verified (ready to submit to SWIFT)
router.put('/verify/:transactionId', authMiddleware(['employee']), async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    transaction.status = 'Verified'; // Update the status
    await transaction.save();
    res.json({ message: 'Transaction verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying transaction' });
  }
});

// Final route to submit transactions to SWIFT (mark as completed)
router.put('/submit-to-swift/:transactionId', authMiddleware(['employee']), async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    transaction.status = 'Completed'; // Update the status
    await transaction.save();
    res.json({ message: 'Transaction submitted to SWIFT successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting transaction to SWIFT' });
  }
});

export default router;
