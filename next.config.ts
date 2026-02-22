import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// GitHub Pages project name (used for basePath and assetPrefix)
const repoName = "shiki-loader";

const nextConfig: NextConfig = {
  // Enable static HTML export for the entire app
  output: "export",

  // Required when using `output: "export"` with the App Router
  images: {
    unoptimized: true,
  },

  // Make exported assets work on GitHub Pages project URL
  // e.g. https://<user>.github.io/shiki-loader/
  basePath: isProd ? `/${repoName}` : undefined,
  assetPrefix: isProd ? `/${repoName}` : undefined,

  reactCompiler: true,
};

export default nextConfig;
