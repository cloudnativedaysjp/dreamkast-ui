# syntax = docker/dockerfile:1.4

FROM node:22.18-alpine AS base
WORKDIR /base
COPY --link package.json yarn.lock ./
RUN --mount=type=cache,target=/tmp/yarn_cache \
  YARN_CACHE_FOLDER=/tmp/yarn_cache \
  yarn install

FROM node:22.18-alpine
RUN apk add --no-cache tini
WORKDIR /base
COPY --link --from=base /base ./
COPY --link . .
RUN yarn build

ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=$SENTRY_RELEASE

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "/usr/local/bin/yarn", "start", "-p", "3001" ]
EXPOSE 3001
