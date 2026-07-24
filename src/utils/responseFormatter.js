exports.formatSuccess = (data) => ({
  success: true,
  data,
});

exports.formatError = (message, details = {}) => ({
  success: false,
  error: { message, ...details },
});
