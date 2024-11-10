import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.mjs';  // Assuming Customer model is already defined
import Staff from '../models/Staff.mjs';  // Assuming Staff model is already defined
import Employee from '../models/Employee.mjs';  // Assuming Employee model is already defined
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Environment variables (like JWT secret)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use a secure secret from environment

// Customer Registration
router.post('/register', async (req, res) => {
  const { fullName, idNumber, accountNumber, password } = req.body;
  try {
    const customer = new Customer({ fullName, idNumber, accountNumber, password });
    await customer.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Customer Login
router.post('/login', async (req, res) => {
  const { fullName, accountNumber, password } = req.body;
  const customer = await Customer.findOne({ fullName, accountNumber });
  if (!customer) return res.status(401).json({ error: 'Authentication failed' });

  const isPasswordValid = await bcrypt.compare(password, customer.password);
  if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: customer._id, role: 'customer' }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

// Staff Login
router.post('/staff/login', async (req, res) => {
  const { username, password } = req.body;
  const staff = await Staff.findOne({ username });
  if (!staff) return res.status(401).json({ error: 'Authentication failed' });

  const isPasswordValid = await bcrypt.compare(password, staff.password);
  if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: staff._id, role: 'staff' }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

export default router;
