---
sidebar_position: 2
---

# Authentication

All Skribble APIs use JWT (JSON Web Token) bearer authentication. This guide explains how to authenticate and manage your tokens.

## Getting Your Credentials

Before you can authenticate, you need:

1. **API Username** - Your unique identifier
2. **API Key** - Your secret key (keep this secure!)

Contact Skribble to obtain these credentials.

## API Key Types

| Key Type | Prefix | Purpose | Cost |
|----------|--------|---------|------|
| Demo | `api_demo` | Testing and development | Free |
| Production | `api_production` / `api_prod` | Live transactions | Billable |

:::warning
Demo signatures have no legal weight. Use production keys for legally binding signatures.
:::

## Obtaining a Token

Make a POST request to the login endpoint:

```bash
curl -X POST "https://api.skribble.com/v3/access/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your-api-username",
    "api-key": "your-api-key"
  }'
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Using the Token

Include the token in the `Authorization` header for all subsequent requests:

```bash
curl -X GET "https://api.skribble.com/v3/signature-requests" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Token Lifetime

- Tokens are valid for approximately **20 minutes**
- After expiration, you must obtain a new token
- There is no refresh token mechanism - simply re-authenticate

## Best Practices

### Token Management

1. **Cache tokens** - Reuse tokens until they expire to minimize login calls
2. **Handle expiration gracefully** - Implement automatic re-authentication when you receive a 401 error
3. **Don't hardcode credentials** - Use environment variables or a secrets manager

### Security

1. **Never expose API keys** - Keep them server-side only
2. **Use HTTPS** - All API calls must use HTTPS
3. **Rotate keys periodically** - Contact Skribble to rotate compromised keys
4. **Separate environments** - Use demo keys for testing, production keys for live

### Example: Token Caching (Node.js)

```javascript
class SkribbleAuth {
  constructor(username, apiKey) {
    this.username = username;
    this.apiKey = apiKey;
    this.token = null;
    this.tokenExpiry = null;
  }

  async getToken() {
    // Return cached token if still valid (with 1-minute buffer)
    if (this.token && this.tokenExpiry > Date.now() + 60000) {
      return this.token;
    }

    const response = await fetch('https://api.skribble.com/v3/access/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.username,
        'api-key': this.apiKey
      })
    });

    const data = await response.json();
    this.token = data.token;
    this.tokenExpiry = Date.now() + 19 * 60 * 1000; // ~19 minutes

    return this.token;
  }
}
```

### Example: Token Caching (Python)

```python
import time
import requests

class SkribbleAuth:
    def __init__(self, username, api_key):
        self.username = username
        self.api_key = api_key
        self.token = None
        self.token_expiry = 0

    def get_token(self):
        # Return cached token if still valid (with 1-minute buffer)
        if self.token and self.token_expiry > time.time() + 60:
            return self.token

        response = requests.post(
            'https://api.skribble.com/v3/access/login',
            json={
                'username': self.username,
                'api-key': self.api_key
            }
        )

        data = response.json()
        self.token = data['token']
        self.token_expiry = time.time() + 19 * 60  # ~19 minutes

        return self.token
```

## Error Responses

| Status Code | Description | Action |
|-------------|-------------|--------|
| 401 | Invalid credentials or expired token | Check credentials or re-authenticate |
| 403 | Insufficient permissions | Verify API key has required access |
| 429 | Rate limit exceeded | Implement backoff and retry |
