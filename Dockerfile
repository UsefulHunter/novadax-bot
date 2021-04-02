FROM node:alpine

ARG TOKEN
ENV BOT_TOKEN=${TOKEN}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]