# syntax = docker/dockerfile:1.4

FROM node:16.19.1-alpine AS base
WORKDIR /base
COPY --link package.json yarn.lock ./
RUN yarn install

FROM node:16.19.1-alpine
WORKDIR /base
COPY --link --from=base /base ./
COPY --link . .
RUN --mount=type=secret,id=sentry_auth_token,dst=/base/.sentryclirc yarn build

CMD [ "yarn", "start", "-p", "3001" ]
EXPOSE 3001
