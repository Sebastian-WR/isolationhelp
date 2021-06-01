FROM node:14.16.0
ENV NODE_ENV=production
WORKDIR /usr/src
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD [ "node", "app.js" ]