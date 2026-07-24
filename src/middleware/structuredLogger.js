module.exports = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationNs = process.hrtime.bigint() - start;
    const durationMs = Number(durationNs / BigInt(1e6));
    const log = {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      responseTimeMs: durationMs,
    };

    console.log(JSON.stringify(log));
  });

  next();
};
