'use strict';

const REQUIRED_ENV = [
  'JWT_SECRET',
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
    await configurePublicPermissions(strapi);
  },
};

async function configurePublicPermissions(strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const permissionsToGrant = [
    { action: 'api::post.post.find' },
    { action: 'api::post.post.findOne' },
    { action: 'api::caso.caso.find' },
    { action: 'api::caso.caso.findOne' },
    { action: 'api::servicio.servicio.find' },
    { action: 'api::servicio.servicio.findOne' },
    { action: 'api::lead.lead.create' },
  ];

  for (const { action } of permissionsToGrant) {
    try {
      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action, role: publicRole.id } });

      if (!existing) {
        await strapi
          .query('plugin::users-permissions.permission')
          .create({ data: { action, role: publicRole.id, enabled: true } });
      } else if (!existing.enabled) {
        await strapi
          .query('plugin::users-permissions.permission')
          .update({ where: { id: existing.id }, data: { enabled: true } });
      }
    } catch (err) {
      strapi.log.warn(`[Velkor] Could not configure permission for ${action}:`, err.message);
    }
  }
}
