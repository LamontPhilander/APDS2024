import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';

export const login = async (req, res) => {
  const { name, password } = req.body;
  
  try {
    const employee = await Employee.findOne({ name });
    if (!employee) return res.status(401).json({ message: 'Authentication failed' });

    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Authentication failed' });

    const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
