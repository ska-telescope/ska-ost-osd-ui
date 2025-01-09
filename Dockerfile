# pull the base image
FROM node:21-alpine as base

# set the working direction
WORKDIR /app
COPY . .

# install app dependencies and build the app
RUN yarn install && yarn cache clean
RUN yarn build

FROM nginx:1.25.2 as final

# Copy built files
COPY --from=base /app/dist/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/

EXPOSE 80

COPY nginx_env_config.sh .
COPY nginx_env_config.sh /docker-entrypoint.d/

CMD ["nginx", "-g", "daemon off;"]
