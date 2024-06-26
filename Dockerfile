FROM node:20-alpine AS base

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder /app/scripts/entrypoint.sh /app/scripts/entrypoint.sh
COPY --from=builder /app/dist/seed.js /app/dist/seed.js
RUN chmod +x /app/scripts/entrypoint.sh

COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/zmodel /app/zmodel

USER nextjs

EXPOSE 3000

ENV PORT 3000


CMD ["sh", "/app/scripts/entrypoint.sh"]
