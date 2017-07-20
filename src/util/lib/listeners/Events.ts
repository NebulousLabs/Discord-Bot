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

		let platformMessageId: string = await guildStorage.get('Role Reaction Message');
		let spoilersMessageId: string = await guildStorage.get('Spoiler Reaction Message');
		let factionMessageId: string = await guildStorage.get('Faction Reaction Message');

		let roles: Array<Role> = new Array();

		// Platform
		roles[0] = reaction.message.guild.roles.find('name', 'PC');
		roles[1] = reaction.message.guild.roles.find('name', 'Playstation');
		roles[2] = reaction.message.guild.roles.find('name', 'Xbox');
		// Spoilers Enabled
		roles[3] = reaction.message.guild.roles.find('name', 'Spoilers Enabled');
		// Factions
		roles[4] = reaction.message.guild.roles.find('name', 'Dead Orbit');
		roles[5] = reaction.message.guild.roles.find('name', 'Future War Cult');
		roles[6] = reaction.message.guild.roles.find('name', 'New Monarchy');

		// Platform Message
		if (reaction.message.id === platformMessageId) {
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

		// Spoiler Message
		if (reaction.message.id === spoilersMessageId) {
			switch (reaction.emoji.name) {
				case 'D2':
					if (reactionAuthor.roles.has(roles[3].id)) return reaction.remove(user);
					else return await reactionAuthor.addRole(roles[3]);
			}
		}

		// Faction Wars Message
		if (reaction.message.id === factionMessageId) {
			switch (reaction.emoji.name) {
				case 'do':
					// If they already have the role, remove it so they can re-react to add it.
					if (reactionAuthor.roles.has(roles[4].id))
						reaction.remove(user);
					// Else if they don't have the role, give it to them.
					else
						await reactionAuthor.addRole(roles[4]);

					// If they have FWC or NM then remove those roles from them
					await reactionAuthor.removeRoles([roles[5], roles[6]]);
					// and also remove their reactions
					reaction.message.reactions.forEach(async (re: MessageReaction) => {
						if (re.emoji.name === 'do')
							return;
						await re.remove(user);
					});

					return;

				case 'fwc':
					// If they already have the role, remove it so they can re-react to add it.
					if (reactionAuthor.roles.has(roles[5].id))
						reaction.remove(user);
					// Else if they don't have the role, give it to them.
					else
						await reactionAuthor.addRole(roles[5]);

					// If they have DO or NM then remove those roles from them
					await reactionAuthor.removeRoles([roles[4], roles[6]]);
					// and also remove their reactions
					reaction.message.reactions.forEach(async (re: MessageReaction) => {
						if (re.emoji.name === 'fwc')
							return;
						await re.remove(user);
					});

					return;

				case 'nm':
					// If they already have the role, remove it so they can re-react to add it.
					if (reactionAuthor.roles.has(roles[6].id))
						reaction.remove(user);
					// Else if they don't have the role, give it to them.
					else
						await reactionAuthor.addRole(roles[6]);

					// If they have DO or FWC then remove those roles from them
					await reactionAuthor.removeRoles([roles[4], roles[5]]);
					// and also remove their reactions
					reaction.message.reactions.forEach(async (re: MessageReaction) => {
						if (re.emoji.name === 'nm')
							return;
						await re.remove(user);
					});

					return;
			}
		}
	}

	@on('messageReactionRemove')
	private async _onReactionRemove(reaction: MessageReaction, user: User): Promise<any> {
		const reactionAuthor: GuildMember = await reaction.message.guild.fetchMember(user);
		let guildStorage: GuildStorage = await this._client.storage.guilds.get(reaction.message.guild.id);

		let platformMessageId: string = await guildStorage.get('Role Reaction Message');
		let spoilersMessageId: string = await guildStorage.get('Spoiler Reaction Message');
		let factionMessageId: string = await guildStorage.get('Faction Reaction Message');

		let roles: Array<Role> = new Array();

		// Platform
		roles[0] = reaction.message.guild.roles.find('name', 'PC');
		roles[1] = reaction.message.guild.roles.find('name', 'Playstation');
		roles[2] = reaction.message.guild.roles.find('name', 'Xbox');
		// Spoilers Enabled
		roles[3] = reaction.message.guild.roles.find('name', 'Spoilers Enabled');
		// Factions
		roles[4] = reaction.message.guild.roles.find('name', 'Dead Orbit');
		roles[5] = reaction.message.guild.roles.find('name', 'Future War Cult');
		roles[6] = reaction.message.guild.roles.find('name', 'New Monarchy');

		// Platform Message
		if (reaction.message.id === platformMessageId) {
			switch (reaction.emoji.name) {
				case 'blizz':
					return await reactionAuthor.removeRole(roles[0]);

				case 'ps':
					return await reactionAuthor.removeRole(roles[1]);

				case 'xb':
					return await reactionAuthor.removeRole(roles[2]);
			}
		}

		// Spoiler Message
		if (reaction.message.id === spoilersMessageId) {
			switch (reaction.emoji.name) {
				case 'D2':
					return await reactionAuthor.removeRole(roles[3]);
			}
		}

		// Faction Wars Message
		if (reaction.message.id === factionMessageId) {
			switch (reaction.emoji.name) {
				case 'do':
					return await reactionAuthor.removeRole(roles[4]);

				case 'fwc':
					return await reactionAuthor.removeRole(roles[5]);

				case 'nm':
					return await reactionAuthor.removeRole(roles[6]);
			}
		}
	}
}
