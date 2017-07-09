import { Client, ListenerUtil, LogLevel } from 'yamdbf';
import { TextChannel, RichEmbed, Message, Guild, GuildMember, VoiceChannel } from 'discord.js';
import { Events } from './listeners/Events';
import Database from '../../database/Database';

const config: any = require('../../config.json');
const credentials: any = require('../../database.json');
const { once } = ListenerUtil;

export class SweeperClient extends Client {
	// properties
	public config: any;
	public events: any;
	public database: Database;

	// constructor
	public constructor() {
		super({
			name: config.name,
			token: config.token,
			owner: config.owner,
			version: config.version,
			statusText: config.status,
			unknownCommandError: false,
			commandsDir: __dirname + '/../../commands',
			disableBase: [
				'clearlimit',
				'disablegroup',
				'enablegroup',
				'eval',
				'eval:ts',
				'limit',
				'listgroups',
				'ping',
				'reload'
			],
			readyText: 'Ready\u0007',
			ratelimit: '10/1m',
			pause: true,
			logLevel: LogLevel.INFO
		});

		this.config = config;
		this.events = new Events(this);
		this.database = new Database(credentials);
	}

	@once('pause')
	private async _onPause(): Promise<void> {
		await this.setDefaultSetting('prefix', '.');
		this.emit('continue');
	}

	@once('clientReady')
	private async _onClientReady(): Promise<void> {
		await this.user.setAvatar('./img/avatar.jpeg');
	}

	@once('disconnect')
	private async _onDisconnect(): Promise<void> {
		process.exit(100);
	}
}
