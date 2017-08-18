import { Collection, Guild, Message, MessageReaction, RichEmbed, Role, TextChannel, User } from 'discord.js';
import { GuildStorage, ListenerUtil } from 'yamdbf';
import { SweeperClient } from '../SweeperClient';
import * as Schedule from 'node-schedule';
import Constants from '../../Constants';

const { on, registerListeners } = ListenerUtil;

export class RoleManager {
	private client: SweeperClient;

	public constructor(client: SweeperClient) {
		this.client = client;
		registerListeners(this.client, this);
	}

	public async init(): Promise<void> {
		let guildStorage: GuildStorage = await this.client.storage.guilds.get(Constants.serverId);
		let platformMessageId: string = await guildStorage.get('Role Reaction Message');
		let spoilersMessageId: string = await guildStorage.get('Spoiler Reaction Message');
		let factionMessageId: string = await guildStorage.get('Faction Reaction Message');
		const channel: TextChannel = <TextChannel> this.client.channels.get(Constants.assignmentChannelId);
		let message: Message;

		// Platform roles
		if (platformMessageId && channel) {
			try {
				let _this: RoleManager = this;

				await _this.reCacheMessage(channel, platformMessageId);
				await Schedule.scheduleJob('* */12 * * *', async function() {
					await _this.reCacheMessage(channel, platformMessageId);
				});
			}
			catch (err) { console.log(`Could not locate platform message.`); }
		}
		else
			console.log(`Could not locate channel or platform message.`);

		// Spoilers role
		if (spoilersMessageId && channel) {
			try {
				let _this: RoleManager = this;

				await _this.reCacheMessage(channel, spoilersMessageId);
				await Schedule.scheduleJob('* */12 * * *', async function() {
					await _this.reCacheMessage(channel, spoilersMessageId);
				});
			}
			catch (err) { console.log(`Could not locate spoilers message.`); }
		}
		else
			console.log(`Could not locate channel or spoilers message.`);

		// Faction Wars
		if (factionMessageId && channel) {
			try {
				let _this: RoleManager = this;

				await _this.reCacheMessage(channel, factionMessageId);
				await Schedule.scheduleJob('* */12 * * *', async function() {
					await _this.reCacheMessage(channel, factionMessageId);
				});
			}
			catch (err) { console.log(`Could not locate faction message.`); }
		}
		else
			console.log(`Could not locate channel or faction message.`);
	}

	public async reCacheMessage(channel: TextChannel, id: string): Promise<void> {
		try {
			let message = await channel.fetchMessage(id);
			message.reactions.forEach(async (reaction: MessageReaction) => {
				await reaction.fetchUsers();
			});
			return;
		}
		catch (err) { return; }
	}
}
