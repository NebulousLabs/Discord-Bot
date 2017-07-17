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
		let messageId: string = await guildStorage.get('Role Reaction Message');
		const channel: TextChannel = <TextChannel> this.client.channels.get(Constants.assignmentChannelId);
		let message: Message;

		if (messageId && channel) {
			try {
				this.reCacheMessage(channel, messageId);

				await Schedule.scheduleJob('* */12 * * *', async function() {
					this.reCacheMessage(channel, messageId);
				});
			}
			catch (err) { console.log(`Could not locate reaction message.`); }
		}
		else
			console.log(`Could not locate channel or reaction message.`);
	}

	public async reCacheMessage(channel: TextChannel, id: string): Promise<void> {
		try {
			let message = await channel.fetchMessage(id);
			message.reactions.forEach(async (reaction: MessageReaction) => {
				await reaction.fetchUsers();
			});
		}
		catch (err) { console.log(`Could not locate reaction message.`); }
	}
}
