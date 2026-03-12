import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "validation-api-v1/validation-and-conversion-service-api",
    },
    {
      type: "category",
      label: "Access",
      link: {
        type: "doc",
        id: "validation-api-v1/access",
      },
      items: [
        {
          type: "doc",
          id: "validation-api-v1/post-access-login",
          label: "Sign in to receive an access token using JSON to submit credentials",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Validation",
      link: {
        type: "doc",
        id: "validation-api-v1/validation",
      },
      items: [
        {
          type: "doc",
          id: "validation-api-v1/post-validate-document",
          label: "Validate a digitally signed content",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "validation-api-v1/post-validate-signature",
          label: "Validate a digital signature",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "validation-api-v1/post-validate-certificate",
          label: "Validate a digital certificate [ROADMAP]",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "validation-api-v1/delete-validation",
          label: "Deletes the validation",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Additional Information",
      link: {
        type: "doc",
        id: "validation-api-v1/additional-information",
      },
      items: [
        {
          type: "doc",
          id: "validation-api-v1/get-infos-validation",
          label: "Get additional information about the validation itself. Refer to ETSI EN 319 102-1 for the indications and sub-indications that may be encountered.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "validation-api-v1/get-infos-signers",
          label: "Get additional information about the signers of a validation",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "validation-api-v1/get-infos-format",
          label: "Get additional information about the document format",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Reports",
      link: {
        type: "doc",
        id: "validation-api-v1/reports",
      },
      items: [
        {
          type: "doc",
          id: "validation-api-v1/get-reports-skribble",
          label: "Skribble validation report [ROADMAP]",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "validation-api-v1/get-reports-etsi",
          label: "ETSI TS 119 102-2 validation report",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Tooling",
      link: {
        type: "doc",
        id: "validation-api-v1/tooling",
      },
      items: [
        {
          type: "doc",
          id: "validation-api-v1/post-tooling-upload",
          label: "Upload document for processing",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "validation-api-v1/post-tooling-process-check",
          label: "Check document PDF conformance",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "validation-api-v1/post-tooling-process-conform",
          label: "Conform document",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "validation-api-v1/post-tooling-process-compress",
          label: "Compress document",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "validation-api-v1/post-tooling-process-spot-signers",
          label: "Spot document for signature relevant elements",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "validation-api-v1/get-tooling-id",
          label: "Download processed document",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "validation-api-v1/delete-tooling-id",
          label: "Delete processed document",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Billing and Credits",
      link: {
        type: "doc",
        id: "validation-api-v1/billing-and-credits",
      },
      items: [
        {
          type: "doc",
          id: "validation-api-v1/get-billing-credits-infos",
          label: "Credits information",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "validation-api-v1/get-billing-credits-usage",
          label: "Current credit usage",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "validation-api-v1/get-billing-credits-invoiced",
          label: "Invoiced credit details",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
