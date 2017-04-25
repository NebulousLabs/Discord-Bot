'use strict';

import { Client, Command, GuildStorage } from 'yamdbf';
import { Collection, Message, RichEmbed, Role } from 'discord.js';
import Assignment from '../../util/Assignment';

export default class ListRoles extends Command<Client> {
	public constructor(bot: Client) {
		super(bot, {
			name: 'list',
			aliases: ['l'],
			description: 'List Roles',
			usage: '<prefix>list\u000d' +
			'	   <prefix>l',
			extraHelp: 'Use this command to display a list of roles.',
			group: 'assignment',
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		// start typing
		message.channel.startTyping();

		// grab the guild storage, available roles, and server roles
		const guildStorage: GuildStorage = this.client.storage.guilds.get(message.guild.id);
		let availableRoles: Array<any> = await guildStorage.get('Server Roles');
		const serverRoles: Collection<string, Role> = new Collection(Array.from(message.guild.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));

		// grab the two admin level roles
		let adminCommandRole: Role = message.guild.roles.find('name', 'The Vanguard');
		let altAdminCommandRole: Role = message.guild.roles.find('name', 'Moderators');

		// create no role error message embed
		const noRoles: RichEmbed = new RichEmbed()
			.setColor(0x206694)
			.setTitle(message.guild.name + ': Role Synchronization')
			.addField('Current Allowed Roles', '\nNo roles currently allowed.');

		// create columns for output
		let leftCol: string = '';
		let rightCol: string = '';

		// make sure both admin roles are present and that the user has one of them
		if ((adminCommandRole !== null && altAdminCommandRole !== null) && (message.member.roles.find('name', adminCommandRole.name) || message.member.roles.find('name', altAdminCommandRole.name))) {
			// make sure admin role isn't the lowest in the list
			if (adminCommandRole.position === 1 || altAdminCommandRole.position === 1) {
				message.channel.send('Please make sure your admin role isn\'t the lowest in the list.');
				return message.channel.stopTyping();
			}

			serverRoles.forEach((el: Role) => {
				// grab all roles below Admin Role, exclude @everyone and bots
				if (el.position < altAdminCommandRole.position && el.name !== '@everyone' && el.managed === false) {
					leftCol += '\n' + el.name;
					rightCol += (Assignment.existsInArray(availableRoles, el.name)) ? '\n**Allowed**' : '\nNot Allowed';
				}
			});

			// build the output embed
			const modEmbed: RichEmbed = new RichEmbed()
				.setColor(0x274E13)
				.setAuthor(message.guild.name + ': List of Roles', message.guild.iconURL)
				.addField('Roles', leftCol, true)
				.addField('Status', rightCol, true);

			// display the list
			message.channel.send({ embed: modEmbed });
			return message.channel.stopTyping();
		} else {
			if (availableRoles === undefined) {
				message.channel.send({ embed: noRoles });
				return message.channel.stopTyping();
			}

			// iterate through server roles to build leftCol
			availableRoles.forEach((el: any) => leftCol += '\n' + el.name);

			// build the output embed
			const userEmbed: RichEmbed = new RichEmbed()
				.setColor(0x274E13)
				.setAuthor(message.guild.name + ': List of Roles', message.guild.iconURL)
				.setDescription('Run `.gr *.` to get all available roles.')
				.addField('Roles', leftCol, true);

			// display the list
			message.channel.send({ embed: userEmbed });
			return message.channel.stopTyping();
		}
	}
}
