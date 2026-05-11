FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat vips-dev fftw-dev gcc g++ make python3

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 1337
CMD ["sh", "-c", "mkdir -p /app/public/uploads && npm run start"]
