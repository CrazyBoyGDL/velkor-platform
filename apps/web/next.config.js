/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'velkor-api-production.up.railway.app' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/services',
        destination: '/servicios',
        permanent: true,
      },
    ]
  },

  async headers() {
    const scriptSrc = isProd
      ? `script-src 'self' 'unsafe-inline' https://plausible.io ${posthogHost}`
      : `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io ${posthogHost}`;

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              `connect-src 'self' https://plausible.io ${posthogHost}`,
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
