module.exports = ({ env }) => {
  function required(key) {
    const val = env(key);
    if (!val) throw new Error(`[Velkor] Missing required env var: ${key}`);
    return val;
  }

  return {
    url: env('STRAPI_ADMIN_PATH', '/admin'),
    auth: {
      secret: required('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: required('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: required('TRANSFER_TOKEN_SALT'),
      },
    },
  };
};
