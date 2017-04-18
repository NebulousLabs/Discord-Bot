'use strict';

const Client: any = require('yamdbf').Client;
const LogLevel: any = require('yamdbf').LogLevel;
const config: any = require('./config.json');
const path: any = require('path');
const client: any = new Client({
	name: config.name,
	token: config.token,
	config: config,
	selfbot: false,
	version: config.version,
	logLevel: LogLevel.INFO,
	statusText: config.status,
	commandsDir: path.join(__dirname, 'commands'),
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

client.on('disconnect', () => process.exit());
