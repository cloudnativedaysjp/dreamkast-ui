FROM node:current-alpine AS base
WORKDIR /base
COPY package*.json ./
RUN npm install
RUN yarn install --check-files
COPY . .

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN npm run build

FROM node:current-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/src ./src
RUN npm install next

EXPOSE 3000
CMD npm run start
