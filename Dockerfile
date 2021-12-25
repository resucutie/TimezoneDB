FROM node:17-alpine

WORKDIR /app

COPY . .

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm \
    && pnpm install --frozen-lockfile \
    && pnpm run build

FROM node:17-alpine

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm \
    && pnpm install --frozen-lockfile --prod
COPY --from=0 /app/dist .
EXPOSE 8001
ENV DBPATH=/data/default.db
CMD ["node" "./dist"]