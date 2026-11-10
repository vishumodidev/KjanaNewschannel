FROM node:24-alpine AS base
WORKDIR /app

# Copy root manifests and lockfile
COPY package*.json ./
COPY server/package*.json ./server/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/api-contracts/package*.json ./packages/api-contracts/

RUN npm ci --workspace=@diginews/server

# Copy source code and Prisma schema
COPY server ./server
COPY packages ./packages

WORKDIR /app/server
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "start"]

