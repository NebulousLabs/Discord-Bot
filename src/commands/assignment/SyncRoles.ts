'use strict';

import { Client, Command, GuildStorage } from 'yamdbf';
import { Collection, Message, RichEmbed, Role } from 'discord.js';
import Constants from '../../util/Constants';

export default class SyncRoles extends Command<Client> {
	public constructor(bot: Client) {
		super(bot, {
			name: 'sync',
			description: 'Sync Roles',
			usage: '<prefix>sync',
			extraHelp: 'Use this command to remove any non-existent server roles from the list of allowed roles.',
			group: 'assignment',
			roles: ['The Vanguard', 'Moderators'],
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

		// create no role error message embed
		const noRoles: RichEmbed = new RichEmbed()
			.setColor(Constants.embedColor)
			.setAuthor(message.guild.name + ': Role Synchronization', message.guild.iconURL)
			.addField('Current Allowed Roles', '\nNo roles currently allowed.');

		// create array and columns for output
		let updatedRoles: any = Array();
		let currentRoles: string = '';
		let removedRoles: string = '';

		// make sure there are allowed roles
		if (availableRoles === undefined) {
			message.channel.send({ embed: noRoles });
			return message.channel.stopTyping();
		}

		// iterate through availableRoles, create updated list
		availableRoles.forEach((el: any) => {
			if (serverRoles.find('name', el.name)) {
				updatedRoles.push(el);
				currentRoles += '\n' + el.name;
			}
			else
				removedRoles += '\n' + el.name;
		});

		// update availableRoles
		guildStorage.set('Server Roles', updatedRoles);

		// make sure there are current roles
		if (currentRoles === '') {
			message.channel.send({ embed: noRoles });
			return message.channel.stopTyping();
		}

		// check if there are roles to remove
		if (removedRoles === '')
			removedRoles = '*No roles removed*';

		// build the output embed
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.embedColor)
			.setAuthor(message.guild.name + ': Role Synchronization', message.guild.iconURL)
			.addField('Current Allowed Roles', currentRoles)
			.addField('Roles Cleaned from Allowed List', removedRoles);

		// display the list
		message.channel.send({ embed: embed });
		return message.channel.stopTyping();
	}
}
