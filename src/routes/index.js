const express = require('express');
const auditRouter = require('./audit');
const healthRouter = require('./health');

const router = express.Router();

router.use('/health', healthRouter);
router.use('/audit', auditRouter);

module.exports = router;
