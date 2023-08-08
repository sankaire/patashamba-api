FROM node:18-alpine

RUN apk add dumb-init

WORKDIR /usr/src/app

COPY --chown=node:node . /usr/src/app

RUN yarn install

RUN yarn build

USER node

EXPOSE 5500

CMD ["dumb-init", "node", "./dist/src/server.js"]