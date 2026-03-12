---
sidebar_position: 3
---

# Sign API Best Practices

This guide covers best practices for integrating with the Skribble Sign API to create reliable, efficient, and user-friendly signing workflows.

## API Version Selection

**Use Sign API v3** for new integrations. Key advantages:

- Draft workflow allows building signature requests before inviting signers
- Better control over the signing process
- Enhanced multi-document support

## Signature Request Workflow

### Understanding the Draft Workflow (v3)

In v3, signature requests follow this lifecycle:

```
DRAFT → OPEN → SIGNED/DECLINED/WITHDRAWN
```

1. **Create request** (status: `DRAFT`)
2. **Add documents and signers**
3. **Initiate** (status changes to: `OPEN`)
4. **Signers complete** (status: `SIGNED`)

```javascript
// 1. Create signature request in draft
const request = await api.post('/signature-requests', {
  title: 'Contract Agreement',
  message: 'Please sign this contract'
});

// 2. Add document
await api.post(`/signature-requests/${request.id}/documents`, {
  document_id: documentId
});

// 3. Add signer
await api.post(`/signature-requests/${request.id}/signatures`, {
  signer_email_address: 'john@example.com'
});

// 4. Initiate when ready
await api.post(`/signature-requests/${request.id}/initiate`);
```

## Document Handling

### Upload Best Practices

1. **Validate before upload** - Ensure documents are valid PDFs
2. **Use meaningful filenames** - They appear in the signing interface
3. **Optimize file size** - Large files slow down the signing experience
4. **Base64 encode properly** - Documents must be Base64-encoded

```javascript
// Upload a document
const response = await api.post('/documents', {
  title: 'Contract.pdf',
  content_type: 'application/pdf',
  content: base64EncodedPdf
});
```

### Document Limits

| Constraint | Limit |
|------------|-------|
| Documents per request | 50 |
| Single attachment size | 40 MB |
| Total request size | 60 MB |

### Supported Attachment Types

- PDF documents
- Microsoft Office formats (Word, Excel, PowerPoint)
- Images (JPEG, PNG)
- Plain text files

## Signer Management

### Adding Signers

You can add signers in two ways:

**1. By Email (Skribble account required):**

```json
{
  "signer_email_address": "signer@example.com"
}
```

**2. With Identity Data (no account required):**

```json
{
  "signer_identity_data": {
    "email_address": "signer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "mobile_number": "+41791234567",
    "language": "en"
  }
}
```

### Signer Modification Rules

- You can add/remove signers while the request is in `DRAFT` status
- Once any signer has signed, you cannot modify signers
- Use `DELETE /signature-requests/{id}/signatures/{sid}` to remove signers before initiation

## Signature Qualities

Choose the appropriate signature quality based on your requirements:

| Quality | Description | Use Case |
|---------|-------------|----------|
| `SES` | Simple Electronic Signature | Low-risk documents, internal approvals |
| `AES` | Advanced Electronic Signature | Standard contracts, agreements |
| `QES` | Qualified Electronic Signature | High-value contracts, regulatory requirements |
| `DEMO` | Test signature | Development and testing |

### Legislation Compliance

| Legislation | Region | Standard |
|-------------|--------|----------|
| `ZERTES` | Switzerland | Swiss Federal Act on Electronic Signatures |
| `EIDAS` | European Union | EU Regulation on electronic identification |

## Callbacks and Webhooks

### Setting Up Callbacks

Configure callbacks to receive real-time updates:

```json
{
  "callback_success_url": "https://your-app.com/webhooks/skribble/success",
  "callback_error_url": "https://your-app.com/webhooks/skribble/error",
  "callback_update_url": "https://your-app.com/webhooks/skribble/update"
}
```

### Callback Types

| Type | Triggered When |
|------|----------------|
| `SUCCESS` | All signers have signed |
| `UPDATE` | A signer has signed (partial completion) |
| `ERROR` | An error occurred |
| `START_SIGN` | A signer started signing |
| `INITIATE` | Request was initiated |
| `IDENT_ERROR` | Identification error |

### Callback Best Practices

1. **Acknowledge quickly** - Return 200 within 5 seconds
2. **Process asynchronously** - Queue the work, respond immediately
3. **Handle idempotency** - The same callback may be delivered multiple times
4. **Verify authenticity** - Validate callback requests come from Skribble

## Reminders

### Sending Manual Reminders

```bash
POST /signature-requests/{id}/remind
```

### Reminder Limitations

- **Rate limit**: One reminder per signer per hour
- Only works for signers who haven't completed signing
- Consider using automatic reminders for better UX

## Sealing Documents

For documents that need an organizational seal rather than personal signatures:

```javascript
const sealedDoc = await api.post('/seal', {
  content: base64EncodedPdf,
  account_name: 'your-seal-account'
});
```

## SendTo Feature

For simple one-off document signings:

```javascript
// Create a send-to request
const sendTo = await api.post('/sendto', {
  content: base64EncodedPdf,
  signer_email_address: 'signer@example.com',
  title: 'Document to Sign'
});

// Track status
const status = await api.get(`/sendto/${sendTo.id}/track`);

// Download when complete
const signedDoc = await api.get(`/sendto/${sendTo.id}/download`);
```

### SendTo Limitations

- Documents expire after **90 days**
- Unclaimed requests expire after **1 day**
- Simpler than full signature requests but less flexible

## Performance Tips

1. **Batch document uploads** - Upload documents in parallel before creating requests
2. **Cache authentication tokens** - Reuse tokens until they expire
3. **Use pagination** - When listing requests, use `page_number` and `page_size`
4. **Poll efficiently** - Use callbacks instead of polling when possible

## Common Pitfalls

### Avoid These Mistakes

1. **Initiating too early** - Ensure all documents and signers are added before calling `/initiate`
2. **Ignoring status** - Always check `status_overall` before performing actions
3. **Forgetting cleanup** - Delete draft requests that won't be used
4. **Hardcoding URLs** - Use environment-specific base URLs

### Status Checking

Always verify the current status before operations:

```javascript
const request = await api.get(`/signature-requests/${id}`);

if (request.status_overall === 'DRAFT') {
  // Can still add documents/signers
} else if (request.status_overall === 'OPEN') {
  // Waiting for signatures
} else if (request.status_overall === 'SIGNED') {
  // Download the signed documents
}
```
