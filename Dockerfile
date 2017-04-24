FROM node:latest
MAINTAINER https://github.com/r-DestinyTheGame

RUN npm install --global gulp-cli
RUN mkdir Sweeper-Bot
COPY / /root/Sweeper-Bot
RUN cd /root/Sweeper-Bot && npm install && gulp && mv bin/* .

ENV HOME /root/Sweeper-Bot
WORKDIR /root/Sweeper-Bot

CMD ["node", "sweeper.js"]
