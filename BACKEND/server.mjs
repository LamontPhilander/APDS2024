import https from 'https';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import posts from './routes/post.mjs';
import users from './routes/user.mjs';
import rateLimit from 'express-rate-limit';

const PORT = 3000;
const app = express();

// SSL certificate options
const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
};

// Middleware
app.use(cors());
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

// Routes
app.use('/post', posts);
app.use('/user', users);

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
