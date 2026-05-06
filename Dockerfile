FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy built app
COPY dist ./dist
COPY .env ./.env

# Start production server
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/boot.js"]
