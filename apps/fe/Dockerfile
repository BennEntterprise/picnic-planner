# Dockerfile for Frontend
FROM node:20

WORKDIR /app

COPY package.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY public ./public
COPY src ./src

RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]
