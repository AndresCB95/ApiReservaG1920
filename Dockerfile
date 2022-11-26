FROM node:latest

ADD . .

RUN npm install

EXPOSE 8084

ENTRYPOINT [ "node","index.js" ]