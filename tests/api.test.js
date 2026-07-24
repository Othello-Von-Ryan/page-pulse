const request = require('supertest');

process.env.RATE_LIMIT_WINDOW_MS = '60000';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000';
process.env.CACHE_TTL_SECONDS = '300';
process.env.MAX_CONCURRENT_AUDITS = '10';

const app = require('../src/app');

jest.setTimeout(30000);

describe('Page Pulse API', () => {
  test('GET /health returns expected structure', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          status: 'ok',
          uptime: expect.any(Number),
        }),
      }),
    );
  });

  test('POST /audit returns successful audit result', async () => {
    const response = await request(app)
      .post('/audit')
      .send({ url: 'https://example.com' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        url: expect.any(String),
        status: 200,
        responseTime: expect.any(Number),
        contentLength: expect.any(Number),
        title: expect.any(String),
      }),
    );
  });

  describe('validation failures for POST /audit', () => {
    test('missing body returns 400', async () => {
      const response = await request(app).post('/audit');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toEqual(
        expect.objectContaining({ message: expect.any(String) }),
      );
    });

    test('empty object returns 400', async () => {
      const response = await request(app)
        .post('/audit')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBeDefined();
    });

    test('missing url returns 400', async () => {
      const response = await request(app)
        .post('/audit')
        .send({ foo: 'bar' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBeDefined();
    });

    test('invalid URL returns 400', async () => {
      const response = await request(app)
        .post('/audit')
        .send({ url: 'not-a-url' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBeDefined();
    });

    test('unsupported protocol returns 400', async () => {
      const response = await request(app)
        .post('/audit')
        .send({ url: 'ftp://example.com' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBeDefined();
    });

    test('non-string url returns 400', async () => {
      const response = await request(app)
        .post('/audit')
        .send({ url: 123 })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBeDefined();
    });
  });

  test('POST /audit returns 502 for network failure', async () => {
    const response = await request(app)
      .post('/audit')
      .send({ url: 'http://nonexistent.invalid' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(502);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBeDefined();
  });

  test('POST /audit returns cached result for repeated requests', async () => {
    const first = await request(app)
      .post('/audit')
      .send({ url: 'https://example.com' })
      .set('Accept', 'application/json');

    const second = await request(app)
      .post('/audit')
      .send({ url: 'https://example.com' })
      .set('Accept', 'application/json');

    expect(second.status).toBe(200);
    expect(second.body).toEqual(first.body);
  });

  test('rate limiting returns 429 when exceeding configured limit', async () => {
    jest.resetModules();
    process.env.RATE_LIMIT_WINDOW_MS = '1000';
    process.env.RATE_LIMIT_MAX_REQUESTS = '2';
    process.env.CACHE_TTL_SECONDS = '300';
    process.env.MAX_CONCURRENT_AUDITS = '10';

    const limitedApp = require('../src/app');

    await request(limitedApp).get('/health').expect(200);
    await request(limitedApp).get('/health').expect(200);

    const response = await request(limitedApp).get('/health');

    expect(response.status).toBe(429);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ message: 'Too many requests' }),
      }),
    );
  });
});
