# Use official Playwright image — includes Chromium + all system deps
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY . .

ENV NODE_ENV=production

CMD ["npx", "tsx", "worker/index.ts"]
