module.exports = ({ env }) => {
  // JWT_SECRET is required — reject silent undefined
  const jwtSecret = env('JWT_SECRET')
  if (!jwtSecret) {
    throw new Error(
      '[Velkor] Missing required env var: JWT_SECRET\n' +
      '  Generate with: node scripts/generate-secrets.js'
    )
  }

  return {
    'users-permissions': {
      config: { jwtSecret },
    },
  }
}
