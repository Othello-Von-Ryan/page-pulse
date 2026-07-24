const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Pulse API</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f7f9fb; color: #1f2937; }
    .container { max-width: 720px; margin: 0 auto; padding: 32px; }
    h1 { margin-bottom: 0.5rem; }
    p { line-height: 1.6; }
    ul { padding-left: 1.25rem; }
    footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 0.95rem; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Page Pulse API</h1>
    <p>Page Pulse is a production-ready URL auditing API. It validates URLs, fetches web pages, and returns audit metrics for each request.</p>
    <h2>Available endpoints</h2>
    <ul>
      <li><strong>GET</strong> /health</li>
      <li><strong>POST</strong> /audit</li>
    </ul>
    <footer>
      Built for <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer">Digital Heroes Training Task</a>
    </footer>
  </div>
</body>
</html>
`);
});

module.exports = router;
