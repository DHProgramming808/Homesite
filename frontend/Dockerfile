FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx

# Copy built site
COPY --from=build /app/dist ./html

# Add runtime config entrypoint
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]
