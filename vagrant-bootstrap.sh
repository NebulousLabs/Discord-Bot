#!/usr/bin/env bash

# Update sources.
sudo apt-get update

# Install nodejs and npm from latest.
# Do this from nodesource (Chris Lea PPA) as upstream Ubuntu packaging is behind.
# https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install gulp and pm2 globally.
sudo npm install --global gulp pm2

# create link from project to ~/bot
ln -sf /vagrant /home/ubuntu/bot

# Do the npm build stuff.
cd bot && npm install && gulp

# Daemonize an instance. http://pm2.keymetrics.io/
pm2 start /home/ubuntu/bot/bin/sweeper.js
