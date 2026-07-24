const { formatError } = require('../utils/responseFormatter');

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (status >= 500) {
    console.error(err.stack || err);
  }

  const payload = formatError(message);
  res.status(status).json(payload);
};
