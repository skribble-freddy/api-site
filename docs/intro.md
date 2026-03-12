---
sidebar_position: 1
---

# Welcome to Skribble API

Skribble provides a comprehensive e-signing platform that enables businesses to integrate legally binding electronic signatures into their applications. This documentation covers all available APIs and helps you get started quickly.

## Available APIs

### Sign API v3 (Recommended)

The latest version of the signing API with enhanced features including:

- **Draft workflow** - Create signature requests in DRAFT status before initiating
- **Multi-document support** - Up to 50 documents per signature request
- **Flexible signer management** - Add/remove signers, support for signers without Skribble accounts
- **Multiple signature qualities** - SES, AES, and QES signatures
- **Compliance** - Supports both Swiss (ZertES) and EU (eIDAS) legislation

### Sign API v2

The previous version of the signing API. While still supported, we recommend using v3 for new integrations.

### Validation API v1

Validate digitally signed documents and certificates:

- **Document validation** - Verify PDF and XML signatures
- **Signature validation** - Validate CMS/CAdES signatures independently
- **PDF processing** - Convert, conform to PDF/A, and compress documents
- **Compliance reports** - Generate ETSI TS 119 102-2 compliant reports

## Environment Overview

| Environment | Purpose | API Key Prefix |
|-------------|---------|----------------|
| Demo | Testing and development | `api_demo` |
| Production | Live transactions (billable) | `api_production` or `api_prod` |

## Quick Start

1. **Get API credentials** - Contact Skribble to obtain your API username and key
2. **Authenticate** - Call `/access/login` to obtain a JWT token
3. **Make API calls** - Use the token in the `Authorization: Bearer <token>` header
4. **Handle responses** - Process results and implement appropriate error handling

## Base URLs

### Sign API v3
- **Production (CH)**: `https://api.skribble.com/v3`
- **Production (DE)**: `https://api.skribble.de/v3`
- **Staging (CH)**: `https://api.scribital.com/v3`
- **Staging (DE)**: `https://api.scribital.de/v3`

### Validation API v1
- **Production (CH)**: `https://document-validation.skribble.com/v1`
- **Production (DE)**: `https://document-validation.skribble.de/v1`
- **Staging (CH)**: `https://document-validation.scribital.com/v1`
- **Staging (DE)**: `https://document-validation.scribital.de/v1`

## Support

For questions and support, contact us at info@skribble.com
