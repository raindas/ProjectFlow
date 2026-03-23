# # Step 1: Build the React app
# FROM node:23-slim AS build
# WORKDIR /app

# # Note: Render provides environment variables during build time 
# # if you set them in the dashboard.
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL

# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Step 2: Serve with Nginx
# FROM nginx:stable-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# # Add custom nginx config if you use React Router
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Build stage
FROM node:23-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Pass the API URL during build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]