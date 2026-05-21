'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::faq-item.faq-item', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
  },
});
