import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.mjs';  // Assuming Customer model is already defined
import Transaction from '../models/Transaction.mjs';  // Assuming Transaction model is already defined
import Staff from '../models/Staff.mjs';  // Assuming Staff model is already defined
import Employee from '../models/Employee.mjs';  // Assuming Employee model is already defined
import { body, validationResult } from 'express-validator';
import checkAuth from '../middleware/checkAuth.mjs';  // Assuming checkAuth middleware is already defined

const router = express.Router();

// Environment variables (like JWT secret)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use a secure secret from environment

// Customer dashboard route
router.get('/dashboard', checkAuth, async (req, res) => {
    try {
      // Verify the user is a customer
      if (req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Forbidden: Not authorized as a customer' });
      }
  
      // Find the customer by ID (exclude the password)
      const customer = await Customer.findById(req.user.id).select('-password');
      
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      // Fetch transactions linked to this customer
      const transactions = await Transaction.find({ customerId: req.user.id });
  
      res.json({
        fullName: customer.fullName,
        accountNumber: customer.accountNumber,
        transactions: transactions.map(tx => ({
          id: tx._id,
          date: tx.createdAt,
          amount: tx.amount,
          currency: tx.currency,
          status: tx.status
        }))
      });
    } catch (error) {
      console.error('Error fetching customer data:', error);
      res.status(500).json({ error: 'Failed to fetch customer data' });
    }
  });

  export default router;
