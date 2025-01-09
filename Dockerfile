# pull the base image
FROM node:20-alpine as base

# # set the working direction
WORKDIR /app
COPY . .

# install app dependencies and build the app
RUN yarn install && yarn cache clean
RUN yarn build


# Copy built files
COPY --from=base /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]