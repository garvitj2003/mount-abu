import type { NextConfig } from "next";

const INTERNAL_API_URL = process.env.INTERNAL_API_URL || "http://localhost:8000";

// Parse URL for images remotePatterns
const backendUrl = new URL(INTERNAL_API_URL);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/api/city-profile",
        destination: `${INTERNAL_API_URL}/api/city-profile/`,
      },
      {
        source: "/api/proxy/api/contact-diary",
        destination: `${INTERNAL_API_URL}/api/contact-diary/`,
      },
      {
        source: "/api/proxy/:path*",
        destination: `${INTERNAL_API_URL}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: backendUrl.protocol.replace(":", "") as "http" | "https",
        hostname: backendUrl.hostname,
        port: backendUrl.port,
        pathname: "/api/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "minio",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
