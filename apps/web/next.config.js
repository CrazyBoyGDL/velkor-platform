/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isProd = process.env.NODE_ENV === 'production';
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
const turnstileHost = 'https://challenges.cloudflare.com';
const cloudflareInsightsHost = 'https://static.cloudflareinsights.com';
const cloudflareRumHost = 'https://cloudflareinsights.com';
const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || process.env.MEDIA_PUBLIC_URL || 'https://media.velkor.com.mx';
const mediaHost = (() => {
  try {
    return new URL(mediaUrl).hostname;
  } catch {
    return 'media.velkor.com.mx';
  }
})();

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'velkor.com.mx' },
      { protocol: 'https', hostname: 'www.velkor.com.mx' },
      { protocol: 'https', hostname: 'api.velkor.com.mx' },
      { protocol: 'https', hostname: 'media.velkor.com.mx' },
      { protocol: 'https', hostname: mediaHost },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.velkor.com.mx' }],
        destination: 'https://velkor.com.mx/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'velkor-web-production.up.railway.app' }],
        destination: 'https://velkor.com.mx/:path*',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/servicios',
        permanent: true,
      },
    ]
  },

  async headers() {
    const scriptSrc = isProd
      ? `script-src 'self' 'unsafe-inline' https://plausible.io ${posthogHost} ${turnstileHost} ${cloudflareInsightsHost}`
      : `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io ${posthogHost} ${turnstileHost} ${cloudflareInsightsHost}`;

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Origin-Agent-Cluster', value: '?1' },
          { key: 'Permissions-Policy',     value: 'accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              `img-src 'self' data: blob: https://velkor.com.mx https://www.velkor.com.mx https://api.velkor.com.mx https://media.velkor.com.mx https://${mediaHost}`,
              `connect-src 'self' https://plausible.io ${posthogHost} ${turnstileHost} ${cloudflareRumHost}`,
              `frame-src 'self' ${turnstileHost}`,
              `child-src ${turnstileHost}`,
              "manifest-src 'self'",
              `media-src 'self' https://media.velkor.com.mx https://${mediaHost}`,
              "worker-src 'self' blob:",
              "form-action 'self'",
              "object-src 'none'",
              "frame-ancestors 'self'",
              ...(isProd ? ["upgrade-insecure-requests"] : []),
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
