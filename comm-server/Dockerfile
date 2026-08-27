FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json* tsconfig.json nest-cli.json ./
COPY src ./src
COPY data ./data
RUN npm install --production=false
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
COPY --from=builder /usr/src/app/dist ./dist
RUN npm install --omit=dev
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/main.js"]
