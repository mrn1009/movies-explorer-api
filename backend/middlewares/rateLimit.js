const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
