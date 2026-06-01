# 1. Dependencias
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat

# Activamos corepack para usar pnpm de forma nativa
RUN corepack enable

WORKDIR /app

# Copiamos el package.json y el NUEVO lockfile de pnpm
COPY package.json pnpm-lock.yaml ./

# Instalación estricta usando pnpm
RUN pnpm install --frozen-lockfile

# 2. Constructor (Build)
FROM node:20-alpine AS builder
WORKDIR /app

# También necesitamos activar corepack en esta etapa
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Argumentos de construcción
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Compilamos usando pnpm
RUN pnpm run build

# 3. Corredor (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Creamos el usuario y el grupo
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextuser

# Copiamos lo mínimo necesario del modo standalone
# Agregamos el flag --chown directamente en el COPY para optimizar el peso de la imagen
COPY --from=builder --chown=nextuser:nodejs /app/public ./public
COPY --from=builder --chown=nextuser:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextuser:nodejs /app/.next/static ./.next/static

# Creamos la carpeta de caché manualmente y le damos permisos al usuario
RUN mkdir -p .next/cache && chown -R nextuser:nodejs .next

# Cambiamos al usuario por seguridad
USER nextuser

EXPOSE 3000

CMD ["node", "server.js"]