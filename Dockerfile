# syntax = docker/dockerfile:1.4

FROM node:16.20.0-alpine AS base
WORKDIR /base
COPY --link package.json yarn.lock ./
RUN --mount=type=cache,target=/tmp/yarn_cache \
  YARN_CACHE_FOLDER=/tmp/yarn_cache \
  yarn install

FROM node:16.20.0-alpine
WORKDIR /base
COPY --link --from=base /base ./
COPY --link . .
ARG SENTRY_AUTH_TOKEN
RUN SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} yarn build

CMD [ "yarn", "start", "-p", "3001" ]
EXPOSE 3001
