FROM node:16.13.1-alpine3.14 AS base
WORKDIR /base
COPY package.json yarn.lock ./
RUN yarn install

FROM node:16.13.1-alpine3.14
WORKDIR /base
COPY --from=base /base ./
COPY . .
RUN yarn build

CMD [ "yarn", "start", "-p", "3001" ]
EXPOSE 3001
