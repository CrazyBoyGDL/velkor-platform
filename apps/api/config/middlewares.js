const mediaHost = (() => {
  const raw = process.env.R2_PUBLIC_URL || process.env.MEDIA_PUBLIC_URL || 'https://media.velkor.com.mx'
  try {
    return new URL(raw).hostname
  } catch {
    return 'media.velkor.com.mx'
  }
})()

module.exports = [
  'strapi::logger',
  'strapi::errors',
  'global::block-public-host',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', mediaHost, 'api.velkor.com.mx'],
          'media-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', mediaHost, 'api.velkor.com.mx'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: (process.env.FRONTEND_URL || 'http://localhost:3000').split(','),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formidable: {
        maxFileSize: Number(process.env.UPLOAD_SIZE_LIMIT || 12 * 1024 * 1024),
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
