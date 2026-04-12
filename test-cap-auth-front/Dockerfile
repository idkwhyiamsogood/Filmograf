# Используем официальный образ Bun
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Этап установки зависимостей (кешируемый слой)
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock* /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Этап сборки (включая devDependencies)
FROM base AS build
RUN apt-get update && apt-get install -y npm
COPY . .
ENV NODE_ENV=production
RUN bun install
RUN NODE_OPTIONS="--max-old-space-size=4096" bun run build-nl

# Финальный образ (только production)
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/package.json .

EXPOSE 3000
CMD ["bun", "run", "start"]