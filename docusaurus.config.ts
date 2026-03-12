import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import type * as Plugin from "@docusaurus/types/src/plugin";

const config: Config = {
  title: "Skribble API Documentation",
  tagline: "API Documentation",
  url: "https://api-doc.skribble.com",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  organizationName: "Skribble AG",
  projectName: "skribble-api-doc",

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.ts"),
          docItemComponent: "@theme/ApiItem",
          routeBasePath: "docs",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    docs: { sidebar: { hideable: true } },
    navbar: {
      title: "Skribble API Docs",
      logo: { alt: "Skribble", src: "img/logo.png" },
      items: [
        { type: "doc", docId: "intro", position: "left", label: "Infos" },
        { label: "Sign API v2", to: "/docs/category/sign-api-v2", position: "left" },
        { label: "Sign API v3", to: "/docs/category/sign-api-v3", position: "left" },
        { label: "Validation API v1", to: "/docs/category/validation-api-v1", position: "left" },
      ],
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Skribble AG.`,
    },
    prism: { additionalLanguages: ["bash", "json", "java", "php", "python", "go", "csharp", "ruby"] },
    languageTabs: [
      { highlight: "bash", language: "curl", logoClass: "curl" },
      { highlight: "javascript", language: "nodejs", logoClass: "nodejs" },
      { highlight: "python", language: "python", logoClass: "python" },
      { highlight: "java", language: "java", logoClass: "java" },
      { highlight: "csharp", language: "csharp", logoClass: "csharp" },
      { highlight: "go", language: "go", logoClass: "go" },
      { highlight: "php", language: "php", logoClass: "php" },
    ],
  } satisfies Preset.ThemeConfig,

  plugins: [
    function webpackFallbackPlugin() {
      return {
        name: "webpack-fallback-plugin",
        configureWebpack() {
          return {
            resolve: {
              fallback: { path: false },
            },
          };
        },
      };
    },
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi",
        docsPluginId: "classic",
        config: {
          signApiV2: {
            specPath: "https://skribble-freddy.github.io/api-doc/sign_api_v2.yaml",
            outputDir: "docs/sign-api-v2",
            downloadUrl: "https://skribble-freddy.github.io/api-doc/sign_api_v2.yaml",
            sidebarOptions: { groupPathsBy: "tag", categoryLinkSource: "tag" },
          },
          signApiV3: {
            specPath: "https://skribble-freddy.github.io/api-doc/sign_api_v3.yaml",
            outputDir: "docs/sign-api-v3",
            downloadUrl: "https://skribble-freddy.github.io/api-doc/sign_api_v3.yaml",
            sidebarOptions: { groupPathsBy: "tag", categoryLinkSource: "tag" },
          },
          validationApiV1: {
            specPath: "https://skribble-freddy.github.io/api-doc/validation_api_v1.yaml",
            outputDir: "docs/validation-api-v1",
            downloadUrl: "https://skribble-freddy.github.io/api-doc/validation_api_v1.yaml",
            sidebarOptions: { groupPathsBy: "tag", categoryLinkSource: "tag" },
          },
        } satisfies Plugin.PluginOptions,
      },
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs"],
};

export default config;