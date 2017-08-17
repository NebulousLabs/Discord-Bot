FROM node:8.0.0
MAINTAINER https://github.com/r-DestinyTheGame
RUN npm install -g gulp-cli
RUN mkdir Sweeper-Bot
WORKDIR /root/Sweeper-Bot
COPY package.json /root/Sweeper-Bot
RUN yarn install
RUN npm link gulp
COPY / /root/Sweeper-Bot
RUN gulp && mv bin/* .
ENV HOME /root/Sweeper-Bot
CMD ["node", "sweeper.js"]
