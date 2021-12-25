FROM node:17-alpine

WORKDIR /app

COPY . .

RUN npm i -g pnpm \
    && pnpm install --frozen-lockfile \
    && pnpm run build

FROM node:17-alpine

WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm \
    && pnpm install --frozen-lockfile --prod
COPY --from=0 /app/dist .
EXPOSE 8001
ENV DBPATH=/data/default.db
ENV PROD=true
CMD node .