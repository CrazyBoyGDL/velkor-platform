FROM node:20-alpine
RUN apk add --no-cache libc6-compat vips-dev fftw-dev gcc g++ make python3
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production

# ── Build-time stubs for Strapi config files ─────────────────────────────────
# `strapi build` (admin panel compilation) loads config/*.js, which throw when
# required env vars are absent. Docker ARG values are available to RUN commands
# but are NOT persisted into the image environment — they leave no trace in the
# final container. Railway injects real secrets at runtime via Variables, which
# override everything, and start.sh enforces their presence before Strapi starts.
ARG ADMIN_JWT_SECRET=strapi-build-placeholder
ARG JWT_SECRET=strapi-build-placeholder
ARG API_TOKEN_SALT=strapi-build-salt-placeholder
ARG TRANSFER_TOKEN_SALT=strapi-build-salt-placeholder
ARG APP_KEYS=build-key-1,build-key-2,build-key-3,build-key-4

RUN npm run build
EXPOSE 1337
# start.sh lives at /app/start.sh (WORKDIR) so `sh ./start.sh` works everywhere
RUN chmod +x ./start.sh
CMD ["sh", "./start.sh"]
