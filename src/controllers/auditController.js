const { formatSuccess } = require('../utils/responseFormatter');
const { auditUrl } = require('../services/auditService');

exports.auditUrl = async (req, res, next) => {
  try {
    const result = await auditUrl(req.body);
    res.status(200).json(formatSuccess(result));
  } catch (error) {
    next(error);
  }
};
