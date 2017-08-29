import { Client, ListenerUtil } from 'yamdbf';
import { TextChannel, RichEmbed, Message, Guild, GuildMember, VoiceChannel } from 'discord.js';
import { Events } from './listeners/Events';
import { RoleManager } from './assignment/RoleManager';
import { ModLoader } from '../../lib/mod/ModLoader';
import Database from '../../database/Database';

const config: any = require('../../config.json');
const credentials: any = require('../../database.json');
const { once } = ListenerUtil;

export class SweeperClient extends Client {
	// properties
	public config: any;
	public events: any;
	public roleManager: RoleManager;
	public database: Database;
	public mod: ModLoader;

	// constructor
	public constructor() {
		super({
			token: config.token,
			owner: config.owner,
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
			pause: true
		});

		this.config = config;
		this.events = new Events(this);
		this.roleManager = new RoleManager(this);
		this.database = new Database(credentials);
	}

	@once('pause')
	private async _onPause(): Promise<void> {
		await this.setDefaultSetting('prefix', '.');
		this.emit('continue');
	}

	@once('clientReady')
	private async _onClientReady(): Promise<void>
	{
		this.mod = new ModLoader(this);
		await this.mod.init();

		await this.roleManager.init();
	}

	@once('disconnect')
	private async _onDisconnect(evt: any ): Promise<void> {
		process.exit(100);
	}
}
