FROM node:22 AS base
WORKDIR /app
COPY package*.json ./

# --- Установка зависимостей ---
FROM base AS deps
RUN npm config set registry https://registry.npmmirror.com \
 && npm install --legacy-peer-deps

# --- Сборка проекта ---
FROM deps AS build
COPY . .
RUN npm run build

# --- Продакшн образ ---
FROM node:22 AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]

# --- Дев образ (для локальной разработки) ---
FROM deps AS dev
WORKDIR /app
COPY . .
RUN npm install -g @nestjs/cli
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
