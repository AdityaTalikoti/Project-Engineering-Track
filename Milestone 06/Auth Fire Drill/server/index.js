
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const authRoutes = require('./routes/auth');
const fragmentRoutes = require('./routes/fragments');

const app = express();
const PORT = 5001;

// CORS restricted to trusted origin with credentials enabled
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Custom cookie-parsing middleware to support double-submit CSRF checks
app.use((req, res, next) => {
  const cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
  }
  req.cookies = cookies;

  // Set CSRF token cookie if missing (not httpOnly so client JS can read it)
  if (!req.cookies.csrfToken) {
    const token = crypto.randomBytes(24).toString('hex');
    res.cookie('csrfToken', token, { sameSite: 'lax', httpOnly: false });
    req.cookies.csrfToken = token;
  }
  next();
});

// CSRF double-submit token checking middleware for state-changing operations
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    // Exempt login and signup routes from CSRF token verification
    if (req.path === '/api/auth/login' || req.path === '/api/auth/signup') {
      return next();
    }
    const cookieToken = req.cookies.csrfToken;
    const headerToken = req.headers['x-csrf-token'];
    
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return res.status(403).json({ error: 'CSRF token mismatch or missing' });
    }
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/fragments', fragmentRoutes);

app.get('/', (req, res) => {
  res.send('Fragments API Running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
