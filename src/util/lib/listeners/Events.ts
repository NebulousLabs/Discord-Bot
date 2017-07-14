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
	private async _onReaction(reaction: MessageReaction, user: User): Promise<any> {
		if (user.id === this._client.user.id)
			return;

		if (user.bot && user.id !== this._client.user.id)
			return reaction.remove(user);

		const reactionAuthor: GuildMember = await reaction.message.guild.fetchMember(user);
		let guildStorage: GuildStorage = await this._client.storage.guilds.get(reaction.message.guild.id);
		let messageId: string = await guildStorage.get('Role Reaction Message');
		let roles: Array<Role> = new Array();

		roles[0] = reaction.message.guild.roles.find('name', 'PC');
		roles[1] = reaction.message.guild.roles.find('name', 'Playstation');
		roles[2] = reaction.message.guild.roles.find('name', 'Xbox');

		if (reaction.message.id === messageId) {
			switch (reaction.emoji.name) {
				case 'blizz':
					if (reactionAuthor.roles.has(roles[0].id)) return reaction.remove(user);
					else return await reactionAuthor.addRole(roles[0]);

				case 'ps':
					if (reactionAuthor.roles.has(roles[1].id)) return reaction.remove(user);
					else return await reactionAuthor.addRole(roles[1]);

				case 'xb':
					if (reactionAuthor.roles.has(roles[2].id)) return reaction.remove(user);
					else return await reactionAuthor.addRole(roles[2]);
			}
		}
	}

	@on('messageReactionRemove')
	private async _onReactionRemove(reaction: MessageReaction, user: User): Promise<any> {
		if (user.id === this._client.user.id)
			return;

		if (user.bot)
			return reaction.remove(user);

		const reactionAuthor: GuildMember = await reaction.message.guild.fetchMember(user);
		let guildStorage: GuildStorage = await this._client.storage.guilds.get(reaction.message.guild.id);
		let messageId: string = await guildStorage.get('Role Reaction Message');
		let roles: Array<Role> = new Array();

		roles[0] = reaction.message.guild.roles.find('name', 'PC');
		roles[1] = reaction.message.guild.roles.find('name', 'Playstation');
		roles[2] = reaction.message.guild.roles.find('name', 'Xbox');

		if (reaction.message.id === messageId) {
			switch (reaction.emoji.name) {
				case 'blizz':
					return await reactionAuthor.removeRole(roles[0]);

				case 'ps':
					return await reactionAuthor.removeRole(roles[1]);

				case 'xb':
					return await reactionAuthor.removeRole(roles[2]);
			}
		}
	}
}
