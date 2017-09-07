import { Command, GuildStorage, Client } from 'yamdbf';
import { GuildMember, Message, RichEmbed, User, Role } from 'discord.js';
import { SweeperClient } from '../../util/lib/SweeperClient';
import Constants from '../../util/Constants';
import * as _ from 'lodash';

export default class ListChannels extends Command<SweeperClient, Client> {
	public guildId: string;

	public constructor()	{
		super({
			name: 'chan',
			desc: 'Handle Search',
			usage: '<prefix>chan <Argument> <Argument>',
			info: 'Argument information below...\u000d\u000d' +
			'empty : list available channels\u000d' +
			'add : add yourself to this channel\u000d' +
			'del : remove yourself from this channel\u000d',
			group: 'search',
			guildOnly: false
		});
	}

	public async action(message: Message, args: Array<string>): Promise<any> {
		this.guildId = message.guild ? message.guild.id : Constants.defaultGuildId;
		// no user specified
		if (!args[0]) {
			return this.sendRoleList(message);
		}

		// if there was an attempt, args[0] was too short
		if (args[0] && args[0] === 'add')
			return this.addChannel(message, args.slice(1).join(' '));
		if (args[0] && args[0] === 'del')
			return this.delChannel(message, args.slice(1).join(' '));
	}

	private async sendRoleList(message: Message): Promise<any> {
		const guild = this.client.guilds.get(this.guildId);
		const roles = guild.roles;
		let roleMessage: string = 'Here are the channels you may join:\u000d\u000d';

		roles.forEach(role => {
			if (!_.includes(Constants.ExcludedRoles, role.name)) {
				roleMessage += `${role.name}\u000d`;
			}
		});

		roleMessage += 'type \'.chan add <channel name>\' to join the channel';
		if (message.guild) {
			await message.channel.send('DMing you a list of roles');
		}

		let dm = await message.author.createDM();

		return dm.send(roleMessage);
	}

	private async addChannel(message: Message, roleName: string): Promise<any> {
		const guild = this.client.guilds.get(this.guildId);

		let dm = await message.author.createDM();
		let author = await guild.fetchMember(message.author.id);

		let foundRole = this.findRole(roleName);

		if (!foundRole) {
			return dm.send(`The ${roleName} channel is not available`);
		} else {
			if (author.roles.has(foundRole.id)) {
				return dm.send(`You are already in the ${roleName} channel. Use .chan del to leave.`);
			} else {
				await dm.send(`Adding you to the ${roleName} channel...`);
				return await author.addRole(foundRole).then(null, Constants.reportError);
			}
		}
	}

	private async delChannel(message: Message, roleName: string): Promise<any> {
		const guild = this.client.guilds.get(this.guildId);
		let dm = await message.author.createDM();
		let author = await guild.fetchMember(message.author.id);

		let foundRole = this.findRole(roleName);

		if (!foundRole) {
			return dm.send(`The ${roleName} channel is not available`);
		} else {
			if (!author.roles.has(foundRole.id)) {
				return dm.send(`You are not in the ${roleName} channel. Use .chan add to join.`);
			} else {
				await dm.send(`Removing you from the ${roleName} channel...`);
				return await author.removeRole(foundRole).then(null, Constants.reportError);
			}
		}
	}

	private findRole(roleName: string): Role {
		const guild = this.client.guilds.get(this.guildId);
		const roles = guild.roles;
		let availableRoles: Role[] = [];
		roles.forEach(role => {
			if (!_.includes(Constants.ExcludedRoles, role.name)) {
				availableRoles.push(role);
			}
		});

		return availableRoles.find((role: Role) => { return role.name === roleName; });
	}
}
