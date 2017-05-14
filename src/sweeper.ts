'use strict';

const { Client } = require('yamdbf');
const { LogLevel } = require('yamdbf');
const config: any = require('./config.json');
const client: any = new Client({
	name: config.name,
	token: config.token,
	config: config,
	selfbot: false,
	version: config.version,
	logLevel: LogLevel.INFO,
	statusText: config.status,
	commandsDir: './commands',
	disableBase: [
		'clearlimit',
		'disablegroup',
		'enablegroup',
		'eval',
		'limit',
		'listgroups',
		'ping',
		'reload',
		'version'
	]
}).start();

client.on('waiting', async () => {
	await client.setDefaultSetting('prefix', '.');
	client.emit('finished');
});

client.once('clientReady', () => {
	// this command has a rate limit
	// client.user.setAvatar('./img/avatar.jpeg');
});

client.on('disconnect', () => process.exit());

