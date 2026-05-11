# syntax=docker/dockerfile:1

FROM oven/bun:1.2-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN bun install

FROM oven/bun:1.2-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
ARG NEXT_PUBLIC_WEB3AUTH_NETWORK=sapphire_devnet
ARG NEXT_PUBLIC_MYAPO_API_BASE_URL=https://api.myapo.xyz

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=$NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
ENV NEXT_PUBLIC_WEB3AUTH_NETWORK=$NEXT_PUBLIC_WEB3AUTH_NETWORK
ENV NEXT_PUBLIC_MYAPO_API_BASE_URL=$NEXT_PUBLIC_MYAPO_API_BASE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1.2-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=10000
ENV NEXT_PUBLIC_MYAPO_API_BASE_URL=https://api.myapo.xyz

COPY package.json ./
RUN bun install --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 10000

CMD ["bun", "run", "start"]
