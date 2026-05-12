'use strict';

module.exports = {
  register() {},

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
    // Posts — public read
    { action: 'api::post.post.find', roleId: publicRole.id },
    { action: 'api::post.post.findOne', roleId: publicRole.id },
    // Casos — public read
    { action: 'api::caso.caso.find', roleId: publicRole.id },
    { action: 'api::caso.caso.findOne', roleId: publicRole.id },
    // Servicios — public read
    { action: 'api::servicio.servicio.find', roleId: publicRole.id },
    { action: 'api::servicio.servicio.findOne', roleId: publicRole.id },
    // Leads — public create only (no read — privacy)
    { action: 'api::lead.lead.create', roleId: publicRole.id },
  ];

  for (const { action, roleId } of permissionsToGrant) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: roleId } });

    if (!existing) {
      await strapi
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: roleId, enabled: true } });
    } else if (!existing.enabled) {
      await strapi
        .query('plugin::users-permissions.permission')
        .update({ where: { id: existing.id }, data: { enabled: true } });
    }
  }
}
