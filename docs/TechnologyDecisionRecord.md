# Technology Decision Record

| Technology | Purpose |
|---|---|
| Express.js | REST API Framework |
| Axios | Outbound HTTP Requests |
| node-cache | In-memory Caching |
| express-rate-limit | Client Rate Limiting |
| Helmet | Security Headers |
| Morgan / Structured Logger | Request Logging |
| Jest + Supertest | Automated Testing |
| Vercel | Deployment Platform |

## Express.js

### Selected technology
Express.js

### Why it was chosen
Express is a widely adopted Node.js web framework that provides a minimal and extensible foundation for building HTTP APIs. Its mature middleware ecosystem, composable routing model, and large community make it an excellent choice for maintainable REST APIs. It fits the project requirements for a simple, production-style service without introducing unnecessary complexity.

### One realistic alternative
Koa.js

### Why that alternative was rejected
Koa offers a lighter middleware model with async functions, but it is less familiar to many teams and requires more boilerplate for standard API concerns. Express was a better fit for rapid implementation and clarity in a qualification assignment.

## Axios

### Selected technology
Axios

### Why it was chosen
Axios offers a promise-based HTTP client with a clean API for requests, built-in timeout handling, redirect handling, response parsing, and consistent error handling. It is a natural fit for outbound webpage fetching in a Node.js service.

### One realistic alternative
node-fetch

### Why that alternative was rejected
`node-fetch` is lower level and closer to the browser Fetch API, but it requires more manual handling for timeouts, redirects, and response parsing. Axios provides those capabilities out of the box, simplifying the audit service.

## node-cache

### Selected technology
node-cache

### Why it was chosen
`node-cache` provides simple in-memory caching with TTL support. It matches the current need for a lightweight cache without external dependencies or infrastructure.

### One realistic alternative
Redis

### Why that alternative was rejected
Redis is a powerful distributed cache, but it adds operational complexity and external infrastructure that are unnecessary for the current single-instance implementation and qualification scope.

## express-rate-limit

### Selected technology
express-rate-limit

### Why it was chosen
`express-rate-limit` is a focused middleware solution for per-IP rate limiting in Express. It integrates cleanly with the existing middleware pipeline and supports configurable limits without requiring custom implementation.

### One realistic alternative
Custom rate limiting middleware

### Why that alternative was rejected
A custom implementation would increase code complexity and risk subtle bugs. Using a proven package keeps the service maintainable and reduces the burden of implementing common rate limiting behavior.

## Helmet

### Selected technology
Helmet

### Why it was chosen
Helmet is the standard middleware for setting security-related HTTP headers in Express applications. It helps harden the API with minimal configuration.

### One realistic alternative
Manual header configuration

### Why that alternative was rejected
Manually managing security headers is error-prone and requires maintenance as best practices evolve. Helmet provides a stable default set of protections without extra effort.

## Morgan

### Selected technology
Morgan

### Why it was chosen
The project primarily uses a custom structured logging middleware with request IDs, but Morgan remains useful for simple development-time request logging and troubleshooting. It provides a lightweight mechanism for request visibility without adding application-level complexity.

### One realistic alternative
Winston

### Why that alternative was rejected
Winston offers advanced transport and persistence options, but the custom structured logger already satisfies the project's production-style logging needs. Morgan keeps logging simple while still supporting request diagnostics.

## Jest + Supertest

### Selected technology
Jest and Supertest

### Why it was chosen
Jest provides a reliable Node.js testing framework with assertion support, and Supertest enables end-to-end HTTP testing of Express routes. Together they provide a complete test stack for API behavior verification.

### One realistic alternative
Mocha + Chai + Supertest

### Why that alternative was rejected
Mocha and Chai are also valid choices, but Jest offers a more integrated experience with built-in assertions, test runner, and snapshot support. Using Jest reduces dependency complexity and is easier to configure.

## Vercel 

### Selected technology
Vercel

### Why it was chosen
Vercel is a popular deployment platform for Node.js applications and APIs with minimal configuration. It provides GitHub-integrated deployments for Node.js APIs with automatic builds and deployments, making it suitable for this lightweight production-style service.

### One realistic alternative
Heroku

### Why that alternative was rejected
Heroku is a capable platform for deploying Node.js applications, but Vercel was selected because of its seamless GitHub integration, automatic deployments, and straightforward configuration for lightweight Node.js APIs. For the scope of this project, Vercel provided a faster deployment workflow with less operational overhead.

## Summary

These technology choices balance simplicity, maintainability, security, performance, automated testing, and production readiness. Express and Axios provide a familiar foundation for request handling and outbound HTTP calls. `node-cache` and `express-rate-limit` keep runtime concerns lightweight and self-contained. Helmet and the structured logging middleware add standard protection and observability without excessive configuration. Jest and Supertest enable robust automated testing. Together, this stack supports a compact, production-style service while avoiding unnecessary operational complexity.
