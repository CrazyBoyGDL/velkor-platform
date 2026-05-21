'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::servicio.servicio', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
  },
});
