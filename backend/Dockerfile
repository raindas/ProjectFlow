FROM node:23-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DATABASE_URL="postgresql://user:password@localhost:5432/projectflow"
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:api"]