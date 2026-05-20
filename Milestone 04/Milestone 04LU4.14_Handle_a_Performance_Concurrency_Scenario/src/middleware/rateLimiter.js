const rateLimit = require('express-rate-limit');

const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 booking requests per windowMs
  message: {
    status: 429,
    message: 'Too many booking attempts from this IP, please try again after a minute.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  bookingLimiter
};
