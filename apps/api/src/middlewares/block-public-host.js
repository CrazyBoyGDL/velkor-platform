'use strict';

const PUBLIC_RAILWAY_SUFFIX = '.up.railway.app';
const HEALTH_PATH = '/api/health';

module.exports = () => {
  return async (ctx, next) => {
    const host = (ctx.get('host') || '').split(':')[0].toLowerCase();

    if (host.endsWith(PUBLIC_RAILWAY_SUFFIX) && ctx.path !== HEALTH_PATH) {
      ctx.status = 404;
      ctx.body = { error: 'not_found' };
      return;
    }

    await next();
  };
};
