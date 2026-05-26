require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3001;

// GAP 3 - CORS configured with a placeholder (Item 05)
// This will require the student to set CORS_ORIGIN in production.
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

app.use(express.json());

// Main App Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Default Catch-all
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS allowed origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
