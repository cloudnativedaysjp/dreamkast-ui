# syntax = docker/dockerfile:1.23

FROM node:22.22-alpine AS base
RUN corepack enable
WORKDIR /base
COPY --link package.json yarn.lock .yarnrc.yml ./
RUN --mount=type=cache,target=/tmp/yarn_cache \
  YARN_CACHE_FOLDER=/tmp/yarn_cache \
  yarn install --immutable

FROM node:22.22-alpine
RUN apk add --no-cache tini && corepack enable
WORKDIR /base
COPY --link --from=base /base ./
COPY --link . .
RUN yarn build

ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=$SENTRY_RELEASE

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "yarn", "start", "-p", "3001" ]
EXPOSE 3001
