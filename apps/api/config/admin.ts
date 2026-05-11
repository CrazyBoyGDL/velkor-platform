export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', env('JWT_SECRET', 'default-secret')),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'tobemodified'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'tobemodified'),
    },
  },
  url: env('PUBLIC_ADMIN_URL', '/admin'),
})
