module.exports = async (req, res, next) => {
  try {
    const { v4: uuidv4 } = await import('uuid');
    const requestId = uuidv4();
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  } catch (error) {
    next(error);
  }
};
