# syntax = docker/dockerfile:1.4

FROM node:16.17.0-alpine3.16 AS base
WORKDIR /base
COPY --link package.json yarn.lock ./
RUN yarn install

FROM node:16.17.0-alpine3.16
WORKDIR /base
COPY --link --from=base /base ./
COPY --link . .
RUN yarn build

CMD [ "yarn", "start", "-p", "3001" ]
EXPOSE 3001
