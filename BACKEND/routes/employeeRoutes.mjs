import express from 'express';
import checkAuth from '../middleware/checkAuth.mjs';  // Middleware for verifying JWT
import { getTransactions, getTransactionById, updateTransactionStatus } from '../controllers/employeeController.mjs';

const router = express.Router();

// Protect all employee routes with the `checkAuth` middleware
router.use(checkAuth);

// Route to get all transactions
router.get('/transactions', getTransactions);

// Route to get a specific transaction by ID
router.get('/transactions/:id', getTransactionById);

// Route to update the status of a transaction
router.put('/transactions/:id/status', updateTransactionStatus);

export default router;
