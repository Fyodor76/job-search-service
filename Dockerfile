# Используем официальный образ Node.js
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости с помощью Yarn
RUN yarn install --production

# Копируем весь проект в контейнер
COPY . .

# Определяем переменные окружения
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_NAME

ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_USER=${DATABASE_USER}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_NAME=${DATABASE_NAME}

# Сборка приложения
RUN yarn build

# Указываем команду запуска
CMD ["yarn", "start:dev"]

# Указываем порт, на котором будет работать приложение
EXPOSE 8080
