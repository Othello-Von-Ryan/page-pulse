const rateLimit = require('express-rate-limit');

const RATE_LIMIT_WINDOW_MS = Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10);
const RATE_LIMIT_MAX_REQUESTS = Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10);

const windowMs = Number.isInteger(RATE_LIMIT_WINDOW_MS) && RATE_LIMIT_WINDOW_MS > 0
  ? RATE_LIMIT_WINDOW_MS
  : 60000;
const max = Number.isInteger(RATE_LIMIT_MAX_REQUESTS) && RATE_LIMIT_MAX_REQUESTS > 0
  ? RATE_LIMIT_MAX_REQUESTS
  : 100;

module.exports = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    const error = new Error('Too many requests');
    error.status = 429;
    next(error);
  },
});
