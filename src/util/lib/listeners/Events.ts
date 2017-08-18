import { GuildStorage, ListenerUtil } from 'yamdbf';
import { TextChannel, RichEmbed, Message, MessageReaction, Guild, GuildMember, Role, User, VoiceChannel } from 'discord.js';
import { SweeperClient } from '../SweeperClient';
import { MuteManager } from '../../../lib/mod/managers/MuteManager';
import Constants from '../../Constants';


const config: any = require('../../../config.json');
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
		console.log('hai, reaction')
		console.log(user)
		if (user.id === this._client.user.id)
			return;

		if (user.bot && user.id !== this._client.user.id)
			return reaction.remove(user);

		const reactionAuthor: GuildMember = await reaction.message.guild.fetchMember(user);
		let guildStorage: GuildStorage = await this._client.storage.guilds.get(reaction.message.guild.id);

		let roleMessageId: string = await guildStorage.get('Role Reaction Message');

		let roles = this.fetchRoles(reaction);
		console.log('here');
		console.log(reaction.message.id);
		console.log(roleMessageId);
		// Role Reaction Message
		if (reaction.message.id === roleMessageId) {

			let role_name = reaction.emoji.name;
			console.log(role_name)
			console.log(roles)

			let role = roles[role_name];
			console.log(role)
			if (role) {
				if (reactionAuthor.roles.has(role.id)) return reaction.remove(user).then(null,Constants.reportError);
				else return await reactionAuthor.addRole(role).then(null,Constants.reportError);
			}
			
		}

		
	}

	@on('messageReactionRemove')
	private async _onReactionRemove(reaction: MessageReaction, user: User): Promise<any> {
		const reactionAuthor: GuildMember = await reaction.message.guild.fetchMember(user);
		let guildStorage: GuildStorage = await this._client.storage.guilds.get(reaction.message.guild.id);

		let roleMessageId: string = await guildStorage.get('Role Reaction Message');

		let roles = this.fetchRoles(reaction);

		// Platform Message
		if (reaction.message.id === roleMessageId) {
			let role_name = reaction.emoji.name;
			let role = roles[role_name];
			if (role) {
				return await reactionAuthor.removeRole(role).then(null,Constants.reportError);;
			}
		}


	}

	@on('guildMemberRemove')
	private async _onGuildMemberRemove(member: GuildMember, joined: boolean = false): Promise<void> {
		this.logMember(member, joined);

		if (!await this._client.mod.managers.mute.isMuted(member)) return;

		const user: User = member.user;
		this._client.mod.managers.mute.setEvasionFlag(member);
	}

	@on('guildMemberAdd')
	private async _onGuildMemberAdd(member: GuildMember, joined: boolean = true): Promise<void> {
		this.logMember(member, joined);

		if (!await this._client.mod.managers.mute.isMuted(member)) return;
		if (!await this._client.mod.managers.mute.isEvasionFlagged(member)) return;

		const mutedRole: Role = member.guild.roles.find('name', 'Muted');
		await member.setRoles([mutedRole]);
		this._client.mod.managers.mute.clearEvasionFlag(member);
	}

	private logMember(member: GuildMember, joined: boolean): void
	{
		if (!member.guild.channels.exists('name', 'members-log')) return;
		const type: 'join' | 'leave' = joined ? 'join' : 'leave';
		const memberLog: TextChannel = <TextChannel> member.guild.channels.find('name', 'members-log');
		const embed: RichEmbed = new RichEmbed()
			.setColor(joined ? 8450847 : 16039746)
			.setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL)
			.setFooter(joined ? 'User joined' : 'User left' , '')
			.setTimestamp();
		memberLog.send({ embed });
	}

	@on('message')
	private async onMessage(message: Message): Promise<void>
	{
		// Saved for future use
	}

	private fetchRoles(reaction: MessageReaction): { [key:string]:Role} {
		let roles: { [key:string]:Role} = {};
		for (let role of Constants.SiaRoles) {
			roles[role.emoji.split(':')[1]] = reaction.message.guild.roles.find('name', role.name.toLowerCase());
		}
		return roles;
	}
}
