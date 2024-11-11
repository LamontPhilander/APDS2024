import express from 'express';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.mjs';
import paymentRoutes from './routes/paymentRoutes.mjs';
import employeeRoutes from './routes/employeeRoutes.mjs';
import customerRoutes from './routes/customerRoutes.mjs';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = 3001;

// SSL certificate options
const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
};

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(express.json());

// Force HTTPS
app.use((req, res, next) => {
  if (req.protocol === 'http') {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

// Clickjacking protection
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Content Security Policy for XSS protection
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self';");
  next();
});

// Rate Limiting for DDoS protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Route setup
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/customer', customerRoutes);

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
