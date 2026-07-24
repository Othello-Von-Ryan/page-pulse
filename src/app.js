const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');
const requestId = require('./middleware/requestId');
const structuredLogger = require('./middleware/structuredLogger');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

app.use(helmet());
app.use(requestId);
app.use(rateLimiter);
app.use(structuredLogger);
app.use(express.json());

app.use('/', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
