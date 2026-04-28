# 1. Dependencias
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Constructor (Build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Argumentos de construcción (Opcional si usas variables en el build)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# 3. Corredor (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Creamos el usuario y el grupo primero
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextuser

# Copiamos lo mínimo necesario del modo standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Creamos la carpeta de caché manualmente y le damos permisos al usuario
RUN mkdir -p .next/cache && chown -R nextuser:nodejs .next

# Ahora sí, cambiamos al usuario
USER nextuser

EXPOSE 3000

CMD ["node", "server.js"]