FROM node:18 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

ARG REDIS_PROD_URL
ARG BOT_TOKEN
ARG BOT_TOKEN_TEST
ARG NEXT_PROD_URL
ARG NEXT_LOCAL_URL

ENV REDIS_PROD_URL=${REDIS_PROD_URL}
ENV BOT_TOKEN=${BOT_TOKEN} 
ENV BOT_TOKEN_TEST=${BOT_TOKEN_TEST}
ENV NEXT_PROD_URL={NEXT_PROD_URL}
ENV NEXT_LOCAL_URL={NEXT_LOCAL_URL}

RUN yarn build

FROM node:18 AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

RUN yarn install --production

EXPOSE 8082

CMD ["node", "dist/index.js"]
