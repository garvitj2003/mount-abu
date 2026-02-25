import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/api/city-profile",
        destination: "http://localhost:8000/api/city-profile/",
      },
      {
        source: "/api/proxy/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
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
