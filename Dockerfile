FROM node:15.9.0-alpine3.11 AS base
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app/
RUN yarn build

CMD [ "yarn", "start", "-p", "3001" ]
EXPOSE 3001
