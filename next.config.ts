import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
  experimental: { inlineCss: true },
  poweredByHeader: false,
};
export default config;
