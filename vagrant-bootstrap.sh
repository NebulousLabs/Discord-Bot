#!/usr/bin/env bash

# Install nodejs and npm from latest.
# Do this from nodesource (Chris Lea PPA) as upstream Ubuntu packaging is behind.
# https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install gulp and pm2 globally.
sudo npm install --global gulp-cli pm2

# Source our home directory.
home='/home/ubuntu'

# Do the npm build stuff.
mkdir $home/node_modules
cd $home/bot
ln -s $home/node_modules/ $home/bot/node_modules
npm install
gulp

# Daemonize an instance. http://pm2.keymetrics.io/
pm2 start $home/bot/bin/sweeper.js
