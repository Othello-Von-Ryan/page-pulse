const express = require('express');
const { auditUrl } = require('../controllers/auditController');

const router = express.Router();

router.post('/', auditUrl);

module.exports = router;
