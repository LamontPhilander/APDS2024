import express from 'express';
import jwt from 'jsonwebtoken';

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

// Staff-only route to view payments
router.get('/', authMiddleware(['staff']), (req, res) => {
  // Retrieve and send payments data
  res.json({ message: 'Payments data for staff' });
});

export default router;
