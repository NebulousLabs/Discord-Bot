import { Collection, Guild, Message, MessageReaction, RichEmbed, Role, TextChannel, User } from 'discord.js';
import { GuildStorage, ListenerUtil } from 'yamdbf';
import { SweeperClient } from '../SweeperClient';
import * as Schedule from 'node-schedule';
import Constants from '../../Constants';

const { on, registerListeners } = ListenerUtil;

export class RoleManager
{
	private client: SweeperClient;

	public constructor(client: SweeperClient)
	{
		this.client = client;
		registerListeners(this.client, this);
	}

	public async init(): Promise<void>
	{
		let guildStorage: GuildStorage = await this.client.storage.guilds.get(Constants.serverId);
		let messageId: string = await guildStorage.get('Role Reaction Message');
		const channel: TextChannel = <TextChannel> this.client.channels.get(Constants.assignmentChannelId);
		let message: Message;
		if (messageId)
			await channel.fetchMessage(messageId);
		else
			return console.log(`Could not locate reaction message.`);

		await Schedule.scheduleJob('* */12 * * *', async function() {
			try { message = await channel.fetchMessage(messageId); }
			catch (err) { return console.log(`Could not locate reaction message.`); }
		});
	}
}
