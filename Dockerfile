FROM node:12.18.4-alpine AS web-base
ENV PATH /usr/src/node_modules/.bin:$PATH
ENV NODE_PATH /usr/src/node_modules/:$NODE_PATH
WORKDIR /usr/src/project
COPY package.json yarn.lock ./
COPY scripts ./scripts
RUN node scripts/rewrite-package-json.js
RUN rm -rf scripts
RUN yarn --pure-lockfile
COPY . .
RUN mv .env.production .env

FROM web-base AS web-production
RUN yarn build
CMD yarn start
