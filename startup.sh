#!/bin/bash

yarn config set registry https://registry.npm.taobao.org
yarn global add pm2
yarn install 
nohup pm2 start ecosystem.config.js && sleep 5