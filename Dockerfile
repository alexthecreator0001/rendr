FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDeps needed for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
