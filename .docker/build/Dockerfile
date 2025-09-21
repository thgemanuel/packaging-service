FROM node:22.13.1-alpine AS build

RUN apk add --update --no-cache \
    graphviz

WORKDIR /usr/src/app

COPY . .

RUN npm ci
RUN npm run build

FROM node:22.13.1-alpine AS production

USER node
WORKDIR /home/node

COPY --from=build --chown=node:node /usr/src/app/package*.json ./
COPY --from=build --chown=node:node /usr/src/app/node_modules/ ./node_modules/
COPY --from=build --chown=node:node /usr/src/app/dist/ ./dist/

CMD ["node", "dist/main.js"]
