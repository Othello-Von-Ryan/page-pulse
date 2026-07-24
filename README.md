# Page Pulse API

## Project Overview

Page Pulse is a production-style URL audit service for analyzing web pages and returning key page metrics. The API validates incoming URLs, fetches target pages using Axios, and exposes audit details such as HTTP status, response time, content length, and page title.

## Features

- URL validation
- HTTP and HTTPS support
- Axios-based webpage fetching
- Request timeout handling
- Network error handling
- Structured JSON error responses
- In-memory caching using `node-cache`
- Configurable cache TTL
- Concurrency limiting for outbound audits
- Per-client rate limiting
- Request ID generation
- `X-Request-ID` response header
- Structured request logging
- Automated API tests
- GitHub Actions CI workflow

## Tech Stack

- Node.js
- Express.js
- Axios
- node-cache
- express-rate-limit
- uuid
- Jest
- Supertest
- GitHub Actions

## Project Structure

- `src/`
  - `controllers/` - HTTP request handlers
  - `services/` - business logic and audit processing
  - `routes/` - route definitions and routing composition
  - `middleware/` - request lifecycle middleware
  - `utils/` - reusable helpers
- `tests/` - automated API tests
- `.github/workflows/` - CI workflow definitions

## Installation

Clone repository:

```bash
git clone <repository-url>
cd page-pulse
```

Install dependencies:

```bash
npm install
```

Environment setup:

Create a `.env` file based on `.env.example` and adjust values as needed.

## Environment Variables

- `PORT` - HTTP port for the server (default: `3000`)
- `CACHE_TTL_SECONDS` - Time-to-live for cached audit results in seconds
- `MAX_CONCURRENT_AUDITS` - Maximum number of concurrent outbound audit requests
- `RATE_LIMIT_WINDOW_MS` - Rate limit window duration in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests allowed per IP in the window

## Running the Application

```bash
npm run dev
```

The server runs on port `3000` by default unless `PORT` is configured.

## API Documentation

### GET /health

Returns a simple health check response.

Example response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

### POST /audit

Request body:

```json
{
  "url": "https://example.com"
}
```

Successful response example:

```json
{
  "success": true,
  "data": {
    "url": "https://example.com/",
    "status": 200,
    "responseTime": 100,
    "contentLength": 500,
    "title": "Example Domain"
  }
}
```

Error response example:

```json
{
  "success": false,
  "error": {
    "message": "reason"
  }
}
```

## Error Handling

The API returns structured errors with appropriate HTTP status codes:

- `400` - validation errors
- `429` - rate limit exceeded
- `502` - external URL or network failures

## Testing

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

The test suite covers:

- health endpoint
- successful audits
- validation failures
- network failures
- caching behavior
- rate limiting

## CI/CD

GitHub Actions automatically runs the test suite on repository changes via the workflow defined in `.github/workflows/test.yml`.

## Future Scalability

Possible production extensions include:

- distributed cache
- message queues
- persistent audit history
- metrics monitoring

These are future considerations and are not implemented in this repository.
