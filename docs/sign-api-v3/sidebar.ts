import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "sign-api-v3/skribble-api-v-3",
    },
    {
      type: "category",
      label: "Access",
      link: {
        type: "doc",
        id: "sign-api-v3/access",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/access-login",
          label: "Authentication",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Document",
      link: {
        type: "doc",
        id: "sign-api-v3/document",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/upload-document",
          label: "Upload document",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sign-api-v3/get-documents",
          label: "List all accessible documents",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/get-document-metadata",
          label: "Get document metadata",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/delete-document",
          label: "Delete document",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "sign-api-v3/get-document-content",
          label: "Get document content",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/get-document-preview",
          label: "Get document page preview",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Signature",
      link: {
        type: "doc",
        id: "sign-api-v3/signature",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/create-signature-request",
          label: "Create a Signature Request",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sign-api-v3/get-signature-request",
          label: "List and find Signature Requests",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/update-signature-request",
          label: "Update a Signature Request",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "sign-api-v3/initiate-signature-request",
          label: "Invite signers and start signing process",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sign-api-v3/get-signature-request-details",
          label: "Get a Signature Request",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/delete-signature-request",
          label: "Delete a Signature Request",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "sign-api-v3/withdraw-signature-request",
          label: "Withdraw a signature request",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sign-api-v3/get-signature-report",
          label: "Get Signature Request Report",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/add-document-in-signature-request",
          label: "Add an additional document",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sign-api-v3/delete-document-in-signature-request",
          label: "Remove an document",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Signature Signer",
      link: {
        type: "doc",
        id: "sign-api-v3/signature-signer",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/add-signature-signer",
          label: "Add an individual signer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sign-api-v3/remove-signature-signer",
          label: "Remove an individual signer",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Signature Observer",
      link: {
        type: "doc",
        id: "sign-api-v3/signature-observer",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/add-signature-observer",
          label: "Add an observer to a signature request",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sign-api-v3/list-signature-observers",
          label: "List observers of a signature request",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/get-signature-observer",
          label: "Get an observer of a signature request",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/delete-signature-observer",
          label: "Remove an observer from a signature request",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Signature Attachment",
      link: {
        type: "doc",
        id: "sign-api-v3/signature-attachment",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/create-signature-attachment",
          label: "Add an attachment to a signature request",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/get-signature-attachment-content",
          label: "Get Signature Attachment content",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/delete-signature-attachment",
          label: "Remove an attachment from a signature request",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Signature Tracking",
      link: {
        type: "doc",
        id: "sign-api-v3/signature-tracking",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/get-signature-request-details",
          label: "Get a Signature Request",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/remind-signature-request",
          label: "Remind open signers of a signature request",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sign-api-v3/get-signature-request-callbacks",
          label: "Get callbacks detals for a signature request",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Seal",
      link: {
        type: "doc",
        id: "sign-api-v3/seal",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/seal-document",
          label: "Seal a document with a legal entity signature",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "SendTo",
      link: {
        type: "doc",
        id: "sign-api-v3/send-to",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/create-send-to",
          label: "Create Send-To",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sign-api-v3/track-send-to",
          label: "Track Send-To",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/download-send-to",
          label: "Download Send-To document",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sign-api-v3/delete-send-to",
          label: "Delete Send-To",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "User",
      link: {
        type: "doc",
        id: "sign-api-v3/user",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/get-user-signature-qualities",
          label: "Get signature qualities details for a user",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Report",
      link: {
        type: "doc",
        id: "sign-api-v3/report",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/get-activities-signatures-by-business",
          label: "Get signature activities by business",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Monitoring",
      link: {
        type: "doc",
        id: "sign-api-v3/monitoring",
      },
      items: [
        {
          type: "doc",
          id: "sign-api-v3/get-system-health",
          label: "System health",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
