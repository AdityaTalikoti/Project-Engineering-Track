
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  console.error("CRITICAL: JWT_SECRET environment variable is missing!");
  process.exit(1);
}

const signToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { signToken, verifyToken, SECRET };
