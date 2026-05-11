FROM node:20-alpine
RUN apk add --no-cache libc6-compat vips-dev fftw-dev gcc g++ make python3
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npm run build
EXPOSE 1337
COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"]
