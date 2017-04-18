# Sweeper Bot

Installation and running instructions
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