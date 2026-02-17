import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // --- VULNERABILITY FIX: Hide Tech Stack Version ---
  // The report (Page 2) flagged "Next.js 16" exposure.
  // This disables the "X-Powered-By: Next.js" header globally.
  poweredByHeader: false,

  // Good practice: Ensure strict mode is on for better error catching
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Note: We are handling CSP in middleware.ts to support Nonces,
          // so we don't need to duplicate it here.
        ],
      },
    ];
  },
};

export default nextConfig;