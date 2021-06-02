# syntax=docker/dockerfile:1

FROM node:14.16.0
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 80
EXPOSE 3000

CMD [ "node", "app.js" ]