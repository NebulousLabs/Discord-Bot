'use strict';

import { Client, Command } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role } from 'discord.js';
import * as moment from 'moment';

export default class UserStats extends Command<Client> {
	public constructor(bot: Client) {
		super(bot, {
			name: 'us',
			aliases: ['stats'],
			description: 'User Stats',
			usage: '<prefix>us\u000d' +
			'	   <prefix>stats',
			extraHelp: 'Display your Discord stats.',
			group: 'misc',
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		// start typing
		message.channel.startTyping();

		// make sure user is logged in
		if (message.member === null) {
			message.channel.send('Please login in order to check your Discord stats.');
			return message.channel.stopTyping();
		}

		// grab user information
		const guildMember: GuildMember = message.member;
		const joinDiscord: string = moment(guildMember.user.createdAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.user.createdAt, 'days') + ' days ago*';
		const joinServer: string = moment(guildMember.joinedAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.joinedAt, 'days') + ' days ago*';
		const userRoles: Collection<string, Role> = new Collection(Array.from(message.member.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
		let status: string = guildMember.user.presence.status;

		// build user role array
		let roles: Array<Role> = userRoles.filter((el: Role) => { if (el.name !== '@everyone' && el.managed === false) return true; }).map((el: Role) => { return el; });
		let rolesString: string = '*none*';

		// make sure roles isn't empty
		if (roles.length > 0)
			rolesString = roles.join(', ');

		// update status string, based on original status
		if (status === 'online')
			status = 'Status: *Online*';
		if (status === 'offline')
			status = 'Status: *Offline*';
		if (status === 'idle')
			status = 'Status: *Idle*';
		if (status === 'dnd')
			status = 'Status: *Do Not Disturb*';

		// build the embed
		const embed: RichEmbed = new RichEmbed()
			.setColor(0x274E13)
			.setAuthor(guildMember.user.username + '#' + guildMember.user.discriminator, guildMember.user.avatarURL)
			.setDescription(status)
			.addField('Joined Server', joinServer, true)
			.addField('Joined Discord', joinDiscord, true)
			.addField('Roles', rolesString, false)
			.setTimestamp();

		// display stats
		message.channel.send({ embed: embed });
		return message.channel.stopTyping();
	}
}
