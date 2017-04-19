# Sweeper Bot
[![Discord](https://discordapp.com/api/guilds/157728722999443456/embed.png)](https://discord.gg/DestinyReddit)
[![Dependencies Status](https://david-dm.org/r-DestinyTheGame/Sweeper-Bot.svg?maxAge=3600)](https://david-dm.org/r-DestinyTheGame/Sweeper-Bot)
[![devDependencies Status](https://david-dm.org/r-DestinyTheGame/Sweeper-Bot/dev-status.svg)](https://david-dm.org/r-DestinyTheGame/Sweeper-Bot?type=dev)
[![Travis](https://travis-ci.org/r-DestinyTheGame/Sweeper-Bot.svg?branch=master)](https://travis-ci.org/r-DestinyTheGame/Sweeper-Bot)

General purpose bot for the official r/DTG Discord server.

# Installation and running instructions
## Step 1
`npm install`

## Step 2
Setup the config file
- add your bot token
- add your discord ID in owner

## Step 3
Compile the project using gulp

## Step 4
Move compiled .js project to hosting instance

## Step 5
`node sweeper.js`


Alternatively, you can build the bot in docker.
-----------------------------------------------
## Step 1
- Add your config.json file to the base directory

## Step 2
```docker build -t sweeper:latest .```

## Step 3
```docker run -t sweeper```


Alternatively, you can use vagrant.
-----------------------------------
## Step 1:
- Set up your config file.

## Step 2:
`vagrant up default`



# Links
#### Sweeper Bot
- [Sweeper Bot Wiki](https://github.com/r-DestinyTheGame/Sweeper-Bot/wiki) - soon:tm:

#### YAMDBF
- [YAMDBF GitHub](https://github.com/zajrik/yamdbf)
- [YAMDBF Documentation](https://yamdbf.js.org/)

