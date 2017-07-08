import { GuildStorage, ListenerUtil } from 'yamdbf';
import { TextChannel, RichEmbed, Message, MessageReaction, Guild, GuildMember, Role, User, VoiceChannel } from 'discord.js';
import { SweeperClient } from '../SweeperClient';
import Constants from '../../Constants';

const { on, registerListeners } = ListenerUtil;

export class Events {
	private _client: SweeperClient;

	public constructor(client: SweeperClient)
	{
		this._client = client;
		registerListeners(this._client, this);
	}

	@on('voiceStateUpdate')
	private async _onVoiceStateUpdate(oldMember: GuildMember, newMember: GuildMember): Promise<void> {

	}

	@on('messageReactionAdd')
	private async _onReaction(reaction: MessageReaction, user: User): Promise<void> {
		if (user.id === Constants.id)
			return;

		let guildStorage: GuildStorage = this._client.storage.guilds.get(reaction.message.guild.id);
		let messageId: string = await guildStorage.get('Role Reaction Message');
		let roles: Array<Role> = new Array();
		let reactionAuthor: GuildMember;

		roles[0] = reaction.message.guild.roles.find('name', 'PC');
		roles[1] = reaction.message.guild.roles.find('name', 'Playstation');
		roles[2] = reaction.message.guild.roles.find('name', 'Xbox');

		await reaction.message.guild.fetchMember(user).then((u: GuildMember) => {
			return reactionAuthor = u;
		}).catch((err: any) => {
			console.log(`User could not be found.`);
		});

		if (reaction.message.id === messageId) {
			switch (reaction.emoji.name) {
				case 'blizz':
					await reactionAuthor.addRole(roles[0]);
					break;

				case 'ps':
					await reactionAuthor.addRole(roles[1]);
					break;

				case 'xb':
					await reactionAuthor.addRole(roles[2]);
					break;
			}
		}
	}

	@on('messageReactionRemove')
	private async _onReactionRemove(reaction: MessageReaction, user: User): Promise<void> {
		if (user.id === Constants.id)
			return;

		let guildStorage: GuildStorage = this._client.storage.guilds.get(reaction.message.guild.id);
		let messageId: string = await guildStorage.get('Role Reaction Message');
		let roles: Array<Role> = new Array();
		let reactionAuthor: GuildMember;

		roles[0] = reaction.message.guild.roles.find('name', 'PC');
		roles[1] = reaction.message.guild.roles.find('name', 'Playstation');
		roles[2] = reaction.message.guild.roles.find('name', 'Xbox');

		await reaction.message.guild.fetchMember(user).then((u: GuildMember) => {
			return reactionAuthor = u;
		}).catch((err: any) => {
			console.log(`User could not be found.`);
		});

		if (reaction.message.id === messageId) {
			switch (reaction.emoji.name) {
				case 'blizz':
					await reactionAuthor.removeRole(roles[0]);
					break;

				case 'ps':
					await reactionAuthor.removeRole(roles[1]);
					break;

				case 'xb':
					await reactionAuthor.removeRole(roles[2]);
					break;
			}
		}
	}
}
