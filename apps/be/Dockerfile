# Dockerfile for Backend
FROM node:20

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install

EXPOSE 3001
CMD ["npm", "run", "dev"]
