'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::testimonio.testimonio', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
  },
});
