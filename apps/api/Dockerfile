FROM node:20-alpine
RUN apk add --no-cache libc6-compat vips-dev fftw-dev gcc g++ make python3
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 1337
CMD ["sh", "-c", "echo '=== CONFIG ===' && cat /app/config/database.js && echo '=== ENV ===' && echo CLIENT=$DATABASE_CLIENT URL_SET=${DATABASE_URL:+yes} && mkdir -p /app/public/uploads && npm run start"]
