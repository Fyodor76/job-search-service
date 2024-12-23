# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости с помощью Yarn
RUN yarn install --production

# Копируем весь проект в контейнер
COPY . .

# Определяем переменные окружения
ARG NODE_ENV
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_NAME
ARG JWT_SECRET
ARG JWT_SECRET_REFRESH
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_CALLBACK_URL
ARG REDIS_LOCAL_URL
ARG REDIS_PROD_URL
ARG NEXT_PROD_URL
ARG NEXT_LOCAL_URL
ARG COOKIE_DOMAIN
 
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_USER=${DATABASE_USER}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_SECRET_REFRESH=${JWT_SECRET_REFRESH}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV GOOGLE_CALLBACK_URL=${GOOGLE_CALLBACK_URL}
ENV REDIS_LOCAL_URL=${REDIS_LOCAL_URL}
ENV REDIS_PROD_URL=${REDIS_PROD_URL}
ENV NEXT_PROD_URL={NEXT_PROD_URL}
ENV NEXT_LOCAL_URL={NEXT_LOCAL_URL}
ENV COOKIE_DOMAIN={COOKIE_DOMAIN}

# Сборка приложения
RUN yarn build

# Указываем команду запуска
CMD ["yarn", "start"]

# Указываем порт, на котором будет работать приложение
EXPOSE 8080
