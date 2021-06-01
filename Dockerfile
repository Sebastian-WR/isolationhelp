FROM mhart/alpine-node

EXPOSE 80
WORKDIR /app
COPY . /app
CMD ["node", "app.js"]