FROM node:20-alpine
RUN apk add --no-cache libc6-compat vips-dev fftw-dev gcc g++ make python3
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production

# ── Build-time stubs for Strapi config files ─────────────────────────────────
# `strapi build` loads config/*.js, which reject missing production secrets.
# Railway injects real secrets at runtime; these placeholders exist only for
# the admin-panel build process and are not persisted as image environment.
RUN ADMIN_JWT_SECRET=strapi-build-placeholder \
    API_TOKEN_SALT=strapi-build-salt-placeholder \
    TRANSFER_TOKEN_SALT=strapi-build-salt-placeholder \
    APP_KEYS=build-key-1,build-key-2,build-key-3,build-key-4 \
    STRAPI_ADMIN_PATH=/operacion \
    ADMIN_PATH=/operacion \
    npm run build
EXPOSE 1337
# start.sh lives at /app/start.sh (WORKDIR) so `sh ./start.sh` works everywhere
RUN chmod +x ./start.sh
CMD ["sh", "./start.sh"]
