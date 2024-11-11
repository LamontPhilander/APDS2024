import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.mjs';  // Assuming Customer model is already defined
import Staff from '../models/Staff.mjs';  // Assuming Staff model is already defined
import Employee from '../models/Employee.mjs';  // Assuming Employee model is already defined
import { body, validationResult } from 'express-validator';
import checkAuth from '../middleware/checkAuth.mjs';  // Assuming checkAuth middleware is already defined

const router = express.Router();

// Environment variables (like JWT secret)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use a secure secret from environment

// Customer Registration
router.post('/register', async (req, res) => {
  const { fullName, idNumber, accountNumber, password } = req.body;
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new customer with the hashed password
    const customer = new Customer({
      fullName,
      idNumber,
      accountNumber,
      password: hashedPassword // Save the hashed password
    });
    
    // Save the customer to the database
    await customer.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Customer Login
router.post('/login', async (req, res) => {
  const { fullName, accountNumber, password } = req.body;
  
  try {
    console.log("Attempting login for:", fullName, accountNumber); // Log input details

    const customer = await Customer.findOne({ fullName, accountNumber });
    if (!customer) {
      console.log("No customer found with provided name and account number.");
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // In Customer Login
    console.log("Stored hashed password:", customer.password);
    
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    console.log("Is password valid:", isPasswordValid);
    if (!isPasswordValid) {
      console.log("Password mismatch.");
      
      console.log("Form hashed password:", password);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: customer._id, role: 'customer' }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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

// Employee Login
router.post('/employee/login', async (req, res) => {
  const { username, password } = req.body;
  const employee = await Employee.findOne({ username });
  if (!employee) return res.status(401).json({ error: 'Authentication failed' });

  const isPasswordValid = await bcrypt.compare(password, employee.password);
  if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: employee._id, role: 'employee' }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});


export default router;
