import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.mjs';  // Assuming Employee model is already defined
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Environment variables (like JWT secret)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use a secure secret from environment

// Login endpoint
router.post(
  '/login',
  [
    // Input validation middleware
    body('name').isAlphanumeric().withMessage('Username must be alphanumeric'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    try {
      // Find employee by name
      const employee = await Employee.findOne({ name });
      if (!employee) {
        return res.status(401).json({ message: 'Authentication failed: User not found' });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed: Invalid password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: employee._id, role: employee.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send response with the token
      res.status(200).json({
        message: 'Login successful',
        token
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
