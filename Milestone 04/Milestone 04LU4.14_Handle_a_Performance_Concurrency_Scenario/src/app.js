require('dotenv').config();
const express = require('express');
const bookingsRouter = require('./routes/bookings');

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Bookings router
app.use('/api/bookings', bookingsRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
