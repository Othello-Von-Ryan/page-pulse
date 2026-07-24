const axios = require('axios');
const NodeCache = require('node-cache');
const { URL } = require('url');
const { extractTitle } = require('../utils/htmlParser');

const CACHE_TTL_SECONDS = Number.parseInt(process.env.CACHE_TTL_SECONDS, 10);
const cacheTtl = Number.isInteger(CACHE_TTL_SECONDS) && CACHE_TTL_SECONDS > 0 ? CACHE_TTL_SECONDS : 300;
const auditCache = new NodeCache({ stdTTL: cacheTtl, useClones: false });

const MAX_CONCURRENT_AUDITS = Number.parseInt(process.env.MAX_CONCURRENT_AUDITS, 10);
const maxConcurrentAudits = Number.isInteger(MAX_CONCURRENT_AUDITS) && MAX_CONCURRENT_AUDITS > 0 ? MAX_CONCURRENT_AUDITS : 10;
let activeAuditRequests = 0;

const createValidationError = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const createConcurrencyError = () => {
  const error = new Error('Too many concurrent audit requests');
  error.status = 429;
  return error;
};

const validateRequestBody = (payload) => {
  if (payload == null || typeof payload !== 'object' || Array.isArray(payload)) {
    throw createValidationError('Request body must be a JSON object');
  }

  if (!Object.prototype.hasOwnProperty.call(payload, 'url')) {
    throw createValidationError('url field is required');
  }

  const { url } = payload;
  if (typeof url !== 'string') {
    throw createValidationError('url must be a string');
  }

  if (!url.trim()) {
    throw createValidationError('url must be a non-empty string');
  }

  return url.trim();
};

const validateUrl = (value) => {
  let parsed;

  try {
    parsed = new URL(value);
  } catch (err) {
    throw createValidationError('Invalid URL format');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw createValidationError('URL must use http or https');
  }

  return parsed.href;
};

const getCacheKey = (normalizedUrl) => normalizedUrl;

const getCachedAudit = (normalizedUrl) => auditCache.get(normalizedUrl);

const setCachedAudit = (normalizedUrl, payload) => {
  auditCache.set(normalizedUrl, payload);
  return payload;
};

const acquireAuditSlot = () => {
  if (activeAuditRequests >= maxConcurrentAudits) {
    return false;
  }

  activeAuditRequests += 1;
  return true;
};

const releaseAuditSlot = () => {
  if (activeAuditRequests > 0) {
    activeAuditRequests -= 1;
  }
};

const createNetworkError = (original) => {
  const error = new Error('Unable to retrieve URL');
  error.status = 502;

  if (original.code === 'ECONNABORTED') {
    error.message = 'Request timed out';
  } else if (original.code === 'ENOTFOUND' || original.code === 'EAI_AGAIN') {
    error.message = 'Unable to resolve host';
  } else if (original.code === 'ECONNREFUSED') {
    error.message = 'Connection refused';
  } else if (original.code === 'ERR_INVALID_URL') {
    error.message = 'Invalid URL format';
    error.status = 400;
  } else if (original.code === 'ERR_FR_TOO_MANY_REDIRECTS') {
    error.message = 'Too many redirects';
  } else if (original.code === 'ERR_SOCKET_TIMEOUT' || original.code === 'ETIMEDOUT') {
    error.message = 'Request timed out';
  }

  return error;
};

exports.auditUrl = async (payload) => {
  const urlValue = validateRequestBody(payload);
  const targetUrl = validateUrl(urlValue);
  const cacheKey = getCacheKey(targetUrl);

  const cachedResult = getCachedAudit(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  if (!acquireAuditSlot()) {
    throw createConcurrencyError();
  }

  try {
    const start = Date.now();
    let response;

    try {
      response = await axios.get(targetUrl, {
        timeout: 10000,
        maxRedirects: 5,
        responseType: 'text',
        validateStatus: null,
      });
    } catch (err) {
      throw createNetworkError(err);
    }

    if (response.status !== 200) {
      const error = new Error(`Received non-200 status code: ${response.status}`);
      error.status = 502;
      throw error;
    }

    const responseTime = Date.now() - start;
    const content = typeof response.data === 'string' ? response.data : '';
    const contentLengthHeader = response.headers['content-length'];
    const contentLength = contentLengthHeader
      ? Number(contentLengthHeader)
      : Buffer.byteLength(content, 'utf8');

    const result = {
      url: targetUrl,
      status: response.status,
      responseTime,
      contentLength,
      title: extractTitle(content),
    };

    return setCachedAudit(cacheKey, result);
  } finally {
    releaseAuditSlot();
  }
};
