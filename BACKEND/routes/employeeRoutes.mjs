import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Employee from '../models/Employee.mjs';  // Assuming Employee model is already defined
import checkAuth from '../middleware/checkAuth.mjs';  // Middleware for verifying JWT
import { getTransactions, getTransactionById, updateTransactionStatus } from '../controllers/employeeController.mjs';

const router = express.Router();

// Protect all employee routes with the `checkAuth` middleware
router.use(checkAuth);

router.post('/employee/login', async (req, res) => {
    const { username, password } = req.body;
    const employee = await Employee.findOne({ username });
    
    if (!employee) return res.status(401).json({ error: 'Authentication failed' });
  
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });
  
    const token = jwt.sign({ id: employee._id, role: 'employee' }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  });

// Route to get all transactions
router.get('/transactions', getTransactions);

// Route to get a specific transaction by ID
router.get('/transactions/:id', getTransactionById);

// Route to update the status of a transaction
router.put('/transactions/:id/status', updateTransactionStatus);

export default router;
