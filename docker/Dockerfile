FROM node:18 AS build

WORKDIR /app

COPY package* yarn.lock ./
RUN yarn install

COPY . .
RUN yarn run build


FROM nginx:alpine

COPY ./docker/conf.d /etc/nginx/conf.d
COPY --from=build /app/build /usr/share/nginx/html