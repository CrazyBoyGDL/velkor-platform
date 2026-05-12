module.exports = ({ env }) => {
  // APP_KEYS is required — reject insecure default
  const rawKeys = env('APP_KEYS')
  if (!rawKeys) {
    throw new Error(
      '[Velkor] Missing required env var: APP_KEYS\n' +
      '  Generate with: node scripts/generate-secrets.js'
    )
  }

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: rawKeys.split(',').map(k => k.trim()).filter(Boolean),
    },
  }
}
