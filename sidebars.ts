import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Infos",
      items: [
        "intro",
        "authentication",
        "sign-api-best-practices",
        "validation-api-best-practices",
        "common-workflows",
        "error-handling",
      ],
    },
    {
      type: "category",
      label: "Sign API v2",
      link: { type: "generated-index", title: "Sign API v2" },
      items: require("./docs/sign-api-v2/sidebar.ts"),
    },
    {
      type: "category",
      label: "Sign API v3",
      link: { type: "generated-index", title: "Sign API v3" },
      items: require("./docs/sign-api-v3/sidebar.ts"),
    },
    {
      type: "category",
      label: "Validation API v1",
      link: { type: "generated-index", title: "Validation API v1" },
      items: require("./docs/validation-api-v1/sidebar.ts"),
    },
  ],
};

export default sidebars;