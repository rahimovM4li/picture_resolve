import type { NextConfig } from "next";

const config: NextConfig = {
  skipTrailingSlashRedirect: true,
  htmlLimitedBots: /.*/,
  serverExternalPackages: ["sharp", "nodemailer"],
  trailingSlash: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          ...(process.env.ENABLE_INDEXING === "true"
            ? []
            : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]),
        ],
      },
    ];
  },
  images: { unoptimized: true },
  devIndicators: false,
  experimental: { inlineCss: true },
  poweredByHeader: false,
};
export default config;
