---
sidebar_position: 4
---

# Validation API Best Practices

This guide covers best practices for using the Skribble Validation API to verify digital signatures, process documents, and generate compliance reports.

## Base URLs

- **Production (CH)**: `https://document-validation.skribble.com/v1`
- **Production (DE)**: `https://document-validation.skribble.de/v1`
- **Staging (CH)**: `https://document-validation.scribital.com/v1`
- **Staging (DE)**: `https://document-validation.scribital.de/v1`

## Validation Workflow

### Basic Validation Flow

```
Upload → Validate → Get Details → (Optional) Generate Report → Cleanup
```

1. **Submit document** for validation
2. **Receive validation ID** and quick assessment
3. **Query detailed information** using the validation ID
4. **Generate reports** if needed
5. **Resources auto-cleanup** after 10 minutes

### Quick Validation Example

```bash
# Validate a signed PDF
curl -X POST "https://document-validation.skribble.com/v1/validate/document" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "'"$(base64 -i signed-document.pdf)"'"
  }'
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "valid": true,
  "signatures": 2,
  "validSignatures": 2,
  "quality": "QES",
  "legislation": "CH_EU"
}
```

## Understanding Validation Results

### Key Response Fields

| Field | Description |
|-------|-------------|
| `valid` | Overall signature validity (boolean) |
| `signatures` | Total number of signatures found |
| `validSignatures` | Number of valid signatures |
| `quality` | Highest signature quality (SES/AES/QES) |
| `legislation` | Applicable legislation (CH/EU/CH_EU/WORLD) |
| `longTermValidation` | Whether long-term validation is preserved |
| `visualDifferences` | Indicates visual tampering |
| `undefinedChanges` | Indicates unauthorized modifications |

### Signature Quality Levels

| Quality | Description | Trust Level |
|---------|-------------|-------------|
| `QES` | Qualified Electronic Signature | Highest |
| `AES` | Advanced Electronic Signature | High |
| `SES` | Simple Electronic Signature | Basic |

### Legislation Codes

| Code | Region |
|------|--------|
| `CH` | Switzerland only |
| `EU` | European Union only |
| `CH_EU` | Valid in both |
| `WORLD` | Internationally recognized |

## Getting Detailed Information

After validation, use the validation ID to get more details:

### Validation Details

```bash
GET /infos/{id}/validation
```

Returns detailed ETSI EN 319 102-1 compliant validation information.

### Signer Information

```bash
GET /infos/{id}/signers
```

Returns:
- Signer names and contact information
- Certificate details (subject, issuer, serial number)
- Signature timestamps
- Quality level per signature

### Format Information

```bash
GET /infos/{id}/format
```

Returns document format specifications and PDF/A conformance level.

## Document Processing (Tooling)

The Validation API includes powerful document processing capabilities.

### Processing Pipeline

```
Upload → Check → Conform → Compress → Download
```

### 1. Upload Document

```bash
curl -X POST "https://document-validation.skribble.com/v1/tooling/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@document.pdf"
```

### 2. Check Conformance

```bash
POST /tooling/process/{id}/check
```

Verify if the document meets PDF/A standards.

### 3. Conform to Standard

```bash
POST /tooling/process/{id}/conform
```

Convert to a specific PDF/A standard:

```json
{
  "target_conformance": "PDF_A_2B"
}
```

**Available conformance levels:**
- `PDF_A_1A`, `PDF_A_1B`
- `PDF_A_2A`, `PDF_A_2B`, `PDF_A_2U`
- `PDF_A_3A`, `PDF_A_3B`, `PDF_A_3U`

### 4. Compress Document

```bash
POST /tooling/process/{id}/compress
```

Optimize file size with different profiles:

| Profile | Use Case | Compression |
|---------|----------|-------------|
| `archive` | Long-term storage | Balanced |
| `print` | High-quality printing | Minimal |
| `web` | Web distribution | Maximum |

### 5. Auto-detect Signature Fields

```bash
POST /tooling/process/{id}/spotsigners
```

Uses AI to automatically detect signature field locations in the document.

**Note:** This operation may return `423 Locked` while processing. Implement retry logic.

### 6. Download Processed Document

```bash
GET /tooling/{id}
```

## Generating Reports

### Skribble Report

```bash
GET /reports/{id}/skribble
```

Generates a digitally signed PDF validation report.

### ETSI Compliance Report

```bash
GET /reports/{id}/etsi
```

Generates an XML report compliant with ETSI TS 119 102-2 standard.

## Best Practices

### Resource Management

1. **Auto-cleanup** - Validation resources are automatically deleted after 10 minutes
2. **Explicit deletion** - Use `DELETE /validate/{id}` if you're done earlier
3. **Process sequentially** - Tooling operations must complete before starting the next

### Error Handling

Handle the `423 Locked` response for tooling operations:

```javascript
async function processWithRetry(id, operation, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await api.post(`/tooling/process/${id}/${operation}`);

    if (response.status === 423) {
      // Resource is locked, wait and retry
      await sleep(2000 * (i + 1)); // Exponential backoff
      continue;
    }

    return response.data;
  }
  throw new Error('Max retries exceeded');
}
```

### Validation Parameters

Customize validation behavior:

```json
{
  "content": "base64-encoded-pdf",
  "minimum_quality": "QES",
  "legislation": "CH_EU",
  "reject_visual_differences": true,
  "reject_undefined_changes": true
}
```

### Performance Tips

1. **Batch wisely** - Process multiple documents in parallel when possible
2. **Cache results** - Store validation IDs if you need to query details multiple times
3. **Use appropriate endpoints** - Use `/validate/signature` for standalone signature validation
4. **Size limits** - Maximum document size is 50 MB

## Billing and Credits

Monitor your API usage:

### Check Credit Costs

```bash
GET /billing/credits/infos
```

Returns the credit cost for each endpoint.

### View Current Usage

```bash
GET /billing/credits/usage
```

Returns consumption for the current billing period.

### Historical Billing

```bash
GET /billing/credits/invoiced?period=2024-01
```

Returns detailed billing information for a specific period.

## Common Use Cases

### Verify Document Before Processing

```javascript
async function verifyAndProcess(pdfContent) {
  // 1. Validate the document
  const validation = await api.post('/validate/document', {
    content: pdfContent,
    reject_visual_differences: true
  });

  if (!validation.valid) {
    throw new Error('Document validation failed');
  }

  // 2. Get signer details
  const signers = await api.get(`/infos/${validation.id}/signers`);

  // 3. Generate compliance report
  const report = await api.get(`/reports/${validation.id}/etsi`);

  return {
    validation,
    signers,
    report
  };
}
```

### Prepare Document for Signing

```javascript
async function prepareForSigning(pdfContent) {
  // 1. Upload document
  const upload = await api.post('/tooling/upload', { content: pdfContent });

  // 2. Check conformance
  const check = await api.post(`/tooling/process/${upload.id}/check`);

  // 3. Conform to PDF/A-2B if needed
  if (check.conformance !== 'PDF_A_2B') {
    await api.post(`/tooling/process/${upload.id}/conform`, {
      target_conformance: 'PDF_A_2B'
    });
  }

  // 4. Compress for web
  await api.post(`/tooling/process/${upload.id}/compress`, {
    profile: 'web'
  });

  // 5. Download processed document
  return await api.get(`/tooling/${upload.id}`);
}
```
