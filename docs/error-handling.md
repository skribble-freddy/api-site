---
sidebar_position: 6
---

# Error Handling

This guide covers how to handle errors when working with the Skribble APIs, including common error codes, troubleshooting tips, and best practices.

## HTTP Status Codes

### Success Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request succeeded, no content returned |

### Client Error Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 400 | Bad Request | Invalid JSON, missing required fields, validation errors |
| 401 | Unauthorized | Missing, invalid, or expired token |
| 403 | Forbidden | Insufficient permissions for the requested operation |
| 404 | Not Found | Resource doesn't exist or has been deleted |
| 409 | Conflict | Resource state doesn't allow the operation |
| 422 | Unprocessable Entity | Request is valid but cannot be processed |
| 423 | Locked | Resource is being processed (retry later) |
| 429 | Too Many Requests | Rate limit exceeded |

### Server Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 500 | Internal Server Error | Retry with exponential backoff |
| 502 | Bad Gateway | Retry after a short delay |
| 503 | Service Unavailable | Service is temporarily down, retry later |
| 504 | Gateway Timeout | Request took too long, retry |

## Error Response Format

API errors typically return a JSON body with details:

```json
{
  "error": "validation_error",
  "message": "The request contains invalid data",
  "details": [
    {
      "field": "signer_email_address",
      "message": "Invalid email format"
    }
  ]
}
```

## Common Errors and Solutions

### Authentication Errors

#### 401 Unauthorized - Token Expired

```json
{
  "error": "token_expired",
  "message": "The access token has expired"
}
```

**Solution:** Obtain a new token by calling `/access/login`.

```javascript
async function apiCall(url, options) {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${await getToken()}`
    }
  });

  if (response.status === 401) {
    // Token expired, refresh and retry
    await refreshToken();
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${await getToken()}`
      }
    });
  }

  return response;
}
```

#### 401 Unauthorized - Invalid Credentials

```json
{
  "error": "invalid_credentials",
  "message": "Invalid username or API key"
}
```

**Solution:** Verify your credentials are correct and the API key hasn't been revoked.

### Validation Errors

#### 400 Bad Request - Missing Required Field

```json
{
  "error": "validation_error",
  "message": "Required field missing",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**Solution:** Check the API documentation for required fields and ensure all are provided.

#### 400 Bad Request - Invalid Document

```json
{
  "error": "invalid_document",
  "message": "The document could not be processed"
}
```

**Solution:** Ensure the document is:
- A valid PDF
- Properly Base64 encoded
- Within size limits (50 MB for validation, varies for signing)
- Not password protected

### State Errors

#### 409 Conflict - Invalid State Transition

```json
{
  "error": "invalid_state",
  "message": "Cannot modify signature request in current state"
}
```

**Solution:** Check the signature request status before performing operations:

```javascript
async function addSignerSafely(requestId, signerData) {
  const request = await getSignatureRequest(requestId);

  if (request.status_overall !== 'DRAFT') {
    throw new Error('Cannot add signers to a non-draft request');
  }

  return await addSigner(requestId, signerData);
}
```

#### 409 Conflict - Signer Already Signed

```json
{
  "error": "signer_already_signed",
  "message": "Cannot remove a signer who has already signed"
}
```

**Solution:** You cannot modify signers after any party has signed.

### Resource Errors

#### 423 Locked - Resource Being Processed

```json
{
  "error": "resource_locked",
  "message": "The resource is currently being processed"
}
```

**Solution:** Implement retry logic with exponential backoff:

```javascript
async function processWithRetry(operation, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await operation();

      if (response.status === 423) {
        const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s, 8s, 16s
        await sleep(waitTime);
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }
  }

  throw new Error('Max retries exceeded');
}
```

### Rate Limiting

#### 429 Too Many Requests

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retry_after": 60
}
```

**Solution:** Implement rate limiting in your client:

```javascript
class RateLimitedClient {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.minDelay = 100; // ms between requests
  }

  async request(url, options) {
    return new Promise((resolve, reject) => {
      this.queue.push({ url, options, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const { url, options, resolve, reject } = this.queue.shift();

      try {
        const response = await fetch(url, options);

        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || 60;
          await sleep(retryAfter * 1000);
          this.queue.unshift({ url, options, resolve, reject });
          continue;
        }

        resolve(response);
      } catch (error) {
        reject(error);
      }

      await sleep(this.minDelay);
    }

    this.processing = false;
  }
}
```

### Reminder Limitations

#### 429 - Reminder Rate Limited

```json
{
  "error": "reminder_rate_limited",
  "message": "Cannot send another reminder within one hour"
}
```

**Solution:** Track when reminders are sent and enforce the one-hour limit client-side.

## Best Practices

### 1. Implement Comprehensive Error Handling

```javascript
async function makeApiCall(url, options) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      switch (response.status) {
        case 400:
          throw new ValidationError(error.message, error.details);
        case 401:
          throw new AuthenticationError(error.message);
        case 403:
          throw new AuthorizationError(error.message);
        case 404:
          throw new NotFoundError(error.message);
        case 409:
          throw new ConflictError(error.message);
        case 423:
          throw new LockedError(error.message);
        case 429:
          throw new RateLimitError(error.message, error.retry_after);
        default:
          throw new ApiError(error.message || 'Unknown error', response.status);
      }
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new NetworkError(error.message);
  }
}
```

### 2. Log Errors for Debugging

```javascript
async function apiCallWithLogging(url, options) {
  const requestId = generateRequestId();

  console.log(`[${requestId}] Request: ${options.method} ${url}`);

  try {
    const response = await makeApiCall(url, options);
    console.log(`[${requestId}] Success`);
    return response;
  } catch (error) {
    console.error(`[${requestId}] Error: ${error.message}`, {
      status: error.status,
      details: error.details
    });
    throw error;
  }
}
```

### 3. Implement Circuit Breaker Pattern

For high-availability systems, prevent cascading failures:

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000;
    this.failures = 0;
    this.state = 'CLOSED';
    this.nextRetry = null;
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextRetry) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextRetry = Date.now() + this.resetTimeout;
    }
  }
}
```

### 4. Graceful Degradation

Handle API unavailability gracefully:

```javascript
async function getSignatureStatus(requestId) {
  try {
    return await api.get(`/signature-requests/${requestId}`);
  } catch (error) {
    if (error instanceof NetworkError || error.status >= 500) {
      // Return cached status or placeholder
      const cached = await cache.get(`request:${requestId}`);
      if (cached) {
        return { ...cached, _stale: true };
      }
      return { status_overall: 'UNKNOWN', _error: true };
    }
    throw error;
  }
}
```

## Monitoring and Alerting

### Health Check Endpoint

Use the health endpoint to monitor API availability:

```javascript
async function checkApiHealth() {
  try {
    const response = await fetch(`${BASE_URL}/management/health`);
    const health = await response.json();
    return health.status === 'UP';
  } catch {
    return false;
  }
}

// Periodic health check
setInterval(async () => {
  const isHealthy = await checkApiHealth();
  if (!isHealthy) {
    alertOps('Skribble API health check failed');
  }
}, 60000);
```

### Error Rate Monitoring

Track error rates to detect issues early:

```javascript
const errorMetrics = {
  total: 0,
  byStatus: {},
  byEndpoint: {}
};

function recordError(endpoint, status) {
  errorMetrics.total++;
  errorMetrics.byStatus[status] = (errorMetrics.byStatus[status] || 0) + 1;
  errorMetrics.byEndpoint[endpoint] = (errorMetrics.byEndpoint[endpoint] || 0) + 1;
}
```
