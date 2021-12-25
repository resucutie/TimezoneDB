FROM node:17-alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm \
    && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:17-alpine

WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm \
    && pnpm install --frozen-lockfile --prod
EXPOSE 8001
ENV DBPATH=/data/default.db
ENV PROD=true
CMD node .
COPY --from=0 /app/dist .