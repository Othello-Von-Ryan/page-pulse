exports.fetchHealthStatus = () => ({
  status: 'ok',
  uptime: process.uptime(),
});
