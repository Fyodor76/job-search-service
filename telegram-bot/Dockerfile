# Этап 1: Сборка приложения
FROM node:18 AS builder

# Установите рабочую директорию
WORKDIR /app

# Скопируйте package.json и yarn.lock
COPY package.json yarn.lock ./

# Установите все зависимости, включая devDependencies
RUN yarn install

# Скопируйте остальные файлы проекта
COPY . .

ARG REDIS_PROD_URL
ARG BOT_TOKEN
ARG BOT_TOKEN_TEST

ENV REDIS_PROD_URL=${REDIS_PROD_URL}
ENV BOT_TOKEN=${BOT_TOKEN} 
ENV BOT_TOKEN_TEST=${BOT_TOKEN_TEST}

# Скомпилируйте TypeScript в JavaScript
RUN yarn build

# Этап 2: Создание финального образа
FROM node:18 AS runner

# Установите рабочую директорию
WORKDIR /app

# Скопируйте только необходимые файлы из образа builder
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

# Установите только production зависимости
RUN yarn install --production

# Укажите порт, который будет слушать приложение
EXPOSE 8082

# Запустите приложение
CMD ["node", "dist/index.js"]
