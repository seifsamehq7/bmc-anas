import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
  },
  experimental: {
    globalNotFound: true,
  },
  allowedDevOrigins: ["naval-presented-ethnic-elected.trycloudflare.com"],
  async redirects() {
    // Arabic is the default language.
    return [{ source: "/", destination: "/ar", permanent: false }];
  },
};

export default nextConfig;
