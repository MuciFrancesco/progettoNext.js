import type { NextConfig } from 'next';
import path from 'node:path';

const isProd = process.env.NODE_ENV === 'production';
const backendHostname = process.env.BACKEND_HOSTNAME ?? 'localhost';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
  images: {
    remotePatterns: [
      isProd
        ? { protocol: 'https', hostname: backendHostname, pathname: '/uploads/**' }
        : { protocol: 'http', hostname: 'localhost', port: '3333', pathname: '/uploads/**' },
    ],
  },
  async headers() {
    const backendOrigin = isProd
      ? `https://${backendHostname}`
      : 'http://localhost:3333';
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              `img-src 'self' data: blob: ${backendOrigin}`,
              "font-src 'self'",
              `connect-src 'self' ${backendOrigin}`,
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
