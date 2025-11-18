# 1. Etapa: build (con devDependencies)
FROM node:22 AS builder
WORKDIR /app

# Solo los manifests primero
COPY package.json ./

# Aquí SÍ necesitamos devDependencies para Tailwind/PostCSS/etc.
RUN npm install

# Ahora sí copiamos el resto del código
COPY . .

# No horneamos secretos: las env sensibles van en runtime, no aquí
ENV NODE_ENV=production

# Construye Next dentro del contenedor
RUN npm run build


# 2. Etapa: runtime (solo prod deps)
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copiamos package.json para instalar SOLO prod deps
COPY package.json ./

# Instalamos dependencias de producción como root
RUN npm install --omit=dev

# Ahora sí creamos usuario no-root y le damos propiedad
RUN useradd -m nextjs && chown -R nextjs:nextjs /app
USER nextjs

# Copiamos solo lo que hace falta para servir la app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -fsS http://127.0.0.1:3000/ || exit 1

CMD ["npm", "run", "start"]