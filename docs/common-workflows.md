---
sidebar_position: 5
---

# Common Workflows

This guide demonstrates end-to-end workflows for common use cases when integrating with the Skribble APIs.

## Contract Signing Workflow

A typical contract signing flow with multiple parties.

### Workflow Overview

```
1. Upload document
2. Create signature request (DRAFT)
3. Add signers
4. Initiate signing process
5. Monitor progress via callbacks
6. Download signed document
```

### Implementation

```javascript
const BASE_URL = 'https://api.skribble.com/v3';

async function signContract(pdfContent, signers) {
  // 1. Upload the document
  const document = await fetch(`${BASE_URL}/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Contract.pdf',
      content_type: 'application/pdf',
      content: pdfContent // Base64 encoded
    })
  }).then(r => r.json());

  // 2. Create signature request in DRAFT status
  const signatureRequest = await fetch(`${BASE_URL}/signature-requests`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Contract Agreement',
      message: 'Please review and sign this contract.',
      callback_success_url: 'https://your-app.com/webhooks/success',
      callback_update_url: 'https://your-app.com/webhooks/update',
      callback_error_url: 'https://your-app.com/webhooks/error'
    })
  }).then(r => r.json());

  // 3. Add the document to the request
  await fetch(`${BASE_URL}/signature-requests/${signatureRequest.id}/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      document_id: document.id
    })
  });

  // 4. Add each signer
  for (const signer of signers) {
    await fetch(`${BASE_URL}/signature-requests/${signatureRequest.id}/signatures`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signer_identity_data: {
          email_address: signer.email,
          first_name: signer.firstName,
          last_name: signer.lastName,
          language: signer.language || 'en'
        }
      })
    });
  }

  // 5. Initiate the signing process
  await fetch(`${BASE_URL}/signature-requests/${signatureRequest.id}/initiate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return signatureRequest.id;
}
```

### Handling Callbacks

```javascript
// Express.js webhook handler
app.post('/webhooks/success', async (req, res) => {
  const { signature_request_id } = req.body;

  // Download the signed document
  const signedDocument = await fetch(
    `${BASE_URL}/documents/${documentId}/content`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  ).then(r => r.arrayBuffer());

  // Store the signed document
  await saveToStorage(signedDocument);

  // Acknowledge quickly
  res.status(200).send('OK');
});

app.post('/webhooks/update', async (req, res) => {
  const { signature_request_id, signer_email } = req.body;

  // Update your application state
  await updateSigningProgress(signature_request_id, signer_email);

  res.status(200).send('OK');
});
```

## Document Sealing Workflow

For documents that need an organizational seal instead of personal signatures.

```javascript
async function sealDocument(pdfContent) {
  const response = await fetch(`${BASE_URL}/seal`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: pdfContent, // Base64 encoded
      account_name: 'your-seal-account'
    })
  });

  return response.json();
}
```

## Quick Signature (SendTo) Workflow

For simple one-off document signings without the full signature request flow.

```javascript
async function quickSignature(pdfContent, signerEmail) {
  // 1. Create SendTo request
  const sendTo = await fetch(`${BASE_URL}/sendto`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: pdfContent,
      signer_email_address: signerEmail,
      title: 'Document for Signature'
    })
  }).then(r => r.json());

  return sendTo.id;
}

// Check status periodically
async function checkSendToStatus(sendToId) {
  const status = await fetch(`${BASE_URL}/sendto/${sendToId}/track`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  return status;
}

// Download when signed
async function downloadSignedSendTo(sendToId) {
  const response = await fetch(`${BASE_URL}/sendto/${sendToId}/download`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return response.arrayBuffer();
}
```

## Document Validation Workflow

Verify signatures on incoming documents.

```javascript
const VALIDATION_URL = 'https://document-validation.skribble.com/v1';

async function validateSignedDocument(pdfContent) {
  // 1. Validate the document
  const validation = await fetch(`${VALIDATION_URL}/validate/document`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: pdfContent,
      minimum_quality: 'AES',
      reject_visual_differences: true,
      reject_undefined_changes: true
    })
  }).then(r => r.json());

  if (!validation.valid) {
    throw new Error('Document validation failed');
  }

  // 2. Get signer details
  const signers = await fetch(`${VALIDATION_URL}/infos/${validation.id}/signers`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  // 3. Generate compliance report
  const report = await fetch(`${VALIDATION_URL}/reports/${validation.id}/etsi`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.text());

  return {
    isValid: validation.valid,
    quality: validation.quality,
    signers: signers,
    complianceReport: report
  };
}
```

## Document Preparation Workflow

Prepare documents for signing by ensuring PDF/A compliance.

```javascript
async function prepareDocument(pdfContent) {
  // 1. Upload document
  const upload = await fetch(`${VALIDATION_URL}/tooling/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: pdfContent })
  }).then(r => r.json());

  // 2. Check current conformance
  const check = await fetch(`${VALIDATION_URL}/tooling/process/${upload.id}/check`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  // 3. Conform to PDF/A-2B if needed
  if (!check.conformance || !check.conformance.startsWith('PDF_A')) {
    await fetchWithRetry(`${VALIDATION_URL}/tooling/process/${upload.id}/conform`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ target_conformance: 'PDF_A_2B' })
    });
  }

  // 4. Compress for optimal size
  await fetchWithRetry(`${VALIDATION_URL}/tooling/process/${upload.id}/compress`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ profile: 'web' })
  });

  // 5. Download processed document
  const processed = await fetch(`${VALIDATION_URL}/tooling/${upload.id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.arrayBuffer());

  // Cleanup
  await fetch(`${VALIDATION_URL}/tooling/${upload.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return processed;
}

// Helper for handling 423 Locked responses
async function fetchWithRetry(url, options, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);

    if (response.status === 423) {
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
      continue;
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  }
  throw new Error('Max retries exceeded');
}
```

## Bulk Signing Workflow

Process multiple documents efficiently.

```javascript
async function bulkSign(documents, signers) {
  // 1. Upload all documents in parallel
  const uploadedDocs = await Promise.all(
    documents.map(doc =>
      fetch(`${BASE_URL}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: doc.filename,
          content_type: 'application/pdf',
          content: doc.content
        })
      }).then(r => r.json())
    )
  );

  // 2. Create signature request
  const signatureRequest = await fetch(`${BASE_URL}/signature-requests`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Bulk Document Signing',
      message: 'Please sign the attached documents.'
    })
  }).then(r => r.json());

  // 3. Add all documents to the request
  await Promise.all(
    uploadedDocs.map(doc =>
      fetch(`${BASE_URL}/signature-requests/${signatureRequest.id}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ document_id: doc.id })
      })
    )
  );

  // 4. Add signers (sequentially to avoid race conditions)
  for (const signer of signers) {
    await fetch(`${BASE_URL}/signature-requests/${signatureRequest.id}/signatures`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signer_identity_data: {
          email_address: signer.email,
          first_name: signer.firstName,
          last_name: signer.lastName
        }
      })
    });
  }

  // 5. Initiate
  await fetch(`${BASE_URL}/signature-requests/${signatureRequest.id}/initiate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return signatureRequest.id;
}
```

## Monitoring and Reporting Workflow

Track signature activity across your organization.

```javascript
async function getSignatureReport(startDate, endDate) {
  // Get signature activities
  const activities = await fetch(
    `${BASE_URL}/activities/signatures?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  ).then(r => r.json());

  return activities;
}

async function checkSystemHealth() {
  const health = await fetch(`${BASE_URL}/management/health`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  return health.status === 'UP';
}
```

## Complete Integration Example

A full example combining preparation, signing, and validation.

```javascript
class SkribbleIntegration {
  constructor(username, apiKey) {
    this.auth = new SkribbleAuth(username, apiKey);
    this.signApiUrl = 'https://api.skribble.com/v3';
    this.validationApiUrl = 'https://document-validation.skribble.com/v1';
  }

  async getToken() {
    return this.auth.getToken();
  }

  async prepareAndSign(pdfContent, signers) {
    const token = await this.getToken();

    // 1. Prepare the document (ensure PDF/A compliance)
    const preparedPdf = await this.prepareDocument(pdfContent, token);

    // 2. Create and initiate signature request
    const requestId = await this.createSignatureRequest(
      preparedPdf,
      signers,
      token
    );

    return requestId;
  }

  async validateAndArchive(signedPdfContent) {
    const token = await this.getToken();

    // 1. Validate the signed document
    const validation = await this.validateDocument(signedPdfContent, token);

    if (!validation.valid) {
      throw new Error('Signed document is not valid');
    }

    // 2. Generate compliance report
    const report = await this.generateReport(validation.id, token);

    // 3. Archive the document and report
    return {
      document: signedPdfContent,
      validation: validation,
      report: report
    };
  }
}
```
