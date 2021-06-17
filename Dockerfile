FROM node:lts-alpine as builder

ADD . /builder/

WORKDIR /builder

RUN yarn config set registry https://registry.npm.taobao.org \
  && yarn global add pm2 \
  && yarn install \
  && yarn build \

EXPOSE 3000

ENTRYPOINT ["pm2-runtime","ecosystem.config.js"]
