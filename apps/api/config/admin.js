module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', env('JWT_SECRET')),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'tobemodified'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'tobemodified'),
    },
  },
})
