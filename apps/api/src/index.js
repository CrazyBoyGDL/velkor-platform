'use strict';

const { seedAuthorityPosts } = require('./content/authority-posts');
const { configureOperatorLayouts } = require('./content/operator-layouts');

const REQUIRED_ENV = [
  'ADMIN_JWT_SECRET',
  'API_TOKEN_SALT',
  'TRANSFER_TOKEN_SALT',
  'APP_KEYS',
  'DATABASE_HOST',
  'DATABASE_NAME',
  'DATABASE_USERNAME',
  'DATABASE_PASSWORD',
];

module.exports = {
  register() {
    const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      throw new Error(
        `[Velkor] Strapi cannot start — missing required env vars: ${missing.join(', ')}`
      );
    }
  },

  async bootstrap({ strapi }) {
    await configureOperatorLayouts(strapi);
    await seedAuthorityPosts(strapi);
  },
};
