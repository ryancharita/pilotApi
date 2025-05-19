require('dotenv').config();
const cors = require('cors');
const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000; // Fallback port

// Middleware to parse JSON bodies
app.use(express.json());

// Handle CORS properly (restrict origins if needed)
app.use(
  cors({
    origin: '*', // Consider restricting this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Routes
app.use('/api', routes);

// Health Check Route (optional but useful)
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Centralized Error Handler (Optional but good practice)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});
//log api request on console
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

module.exports = app;
