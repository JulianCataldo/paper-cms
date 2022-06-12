FROM node:17.9.0

WORKDIR /usr/app

COPY ./package.json ./pnpm-lock.yaml ./

RUN mkdir ./client ./server

COPY ./client/package.json ./client/pnpm-lock.yaml ./client/
COPY ./server/package.json ./server/pnpm-lock.yaml ./server/

RUN npm run deps:i

COPY ./ ./

# Build static browser assets
RUN pnpm run client

# Run back office + API server
CMD pnpm run server
