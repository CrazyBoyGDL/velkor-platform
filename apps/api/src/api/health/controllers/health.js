'use strict';

module.exports = {
  index(ctx) {
    ctx.body = {
      ok: true,
      service: 'velkor-api',
      timestamp: new Date().toISOString(),
    };
  },
};
