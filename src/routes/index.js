const express = require('express');
const auditRouter = require('./audit');
const healthRouter = require('./health');
const rootRouter = require('./root');

const router = express.Router();

router.use('/', rootRouter);
router.use('/health', healthRouter);
router.use('/audit', auditRouter);

module.exports = router;
