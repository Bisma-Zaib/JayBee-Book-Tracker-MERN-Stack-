const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const externalRoutes = require('./routes/externalRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/booklibrary")
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);           // /api/auth/register, /api/auth/login
app.use('/api/books', bookRoutes);          // /api/books, /api/books/:id
app.use('/api/external', externalRoutes);   // /api/external/books
app.use('/api/stats', statsRoutes);         // /api/stats/stats, /api/stats/:id/status

// Root route
app.get('/', (req, res) => {
  res.json({ message: "JayBee Book Tracker Server is working!" });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});