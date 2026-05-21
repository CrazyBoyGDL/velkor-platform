'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const crypto = require('crypto');

function hasPreviewAccess(ctx) {
  const expected = process.env.BLOG_PREVIEW_SECRET;
  const provided = ctx.get('x-velkor-preview-secret');

  if (!expected || !provided) return false;

  const left = Buffer.from(provided);
  const right = Buffer.from(expected);

  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function forceLivePublicationState(ctx) {
  if (ctx.query?.publicationState === 'preview' && !hasPreviewAccess(ctx)) {
    ctx.query.publicationState = 'live';
  }
}

module.exports = createCoreController('api::post.post', () => ({
  async find(ctx) {
    forceLivePublicationState(ctx);
    return super.find(ctx);
  },

  async findOne(ctx) {
    forceLivePublicationState(ctx);
    return super.findOne(ctx);
  },
}));
