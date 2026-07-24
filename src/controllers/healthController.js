const { formatSuccess } = require('../utils/responseFormatter');
const { fetchHealthStatus } = require('../services/healthService');

exports.getHealth = (req, res) => {
  res.status(200).json(formatSuccess(fetchHealthStatus()));
};
