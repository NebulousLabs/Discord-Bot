'use strict';

import { Client, Command, GuildStorage } from 'yamdbf';
import { GuildMember, Message, RichEmbed, Role } from 'discord.js';
import * as fuzzy from 'fuzzy';
import Assignment from '../../util/Assignment';
import Constants from '../../util/Constants';

export default class DestroyRole extends Command<Client> {
	public constructor(bot: Client) {
		super(bot, {
			name: 'dr',
			description: 'Destroy Role',
			usage: '<prefix>dr <Argument>\u000d' +
			'	   <prefix>dr <Argument>, <Argument>, ...',
			extraHelp: 'This command will remove a specific role from yourself.\u000d\u000d' +
			'Argument information below...\u000d\u000d' +
			'Role Name : The name of the role to be removed.\u000d\u000d' +
			'*If Sweeper Bot tells you to be more specific, type the role as if it were case-sensitive. Sweeper Bot will then find your specific role.',
			group: 'assignment',
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		// make sure a role was specified
		if (args.length === 0)
			return message.channel.send('Please specify a role to destroy.');

		// start typing
		message.channel.startTyping();

		// grab the guild storage, available roles, and server roles
		const guildStorage: GuildStorage = this.client.storage.guilds.get(message.guild.id);
		let availableRoles: Array<any> = await guildStorage.get('Server Roles');

		// create user supplied role vars
		let roleArgs: Array<any> = new Array();
		let role: Role;
		let beMoreSpecific: boolean = false;

		// create display vars
		let invalidRoles: Array<string> = new Array();
		let validRoles: Array<Role> = new Array();
		let inspecificRoles: Array<string> = new Array();
		const embed: RichEmbed = new RichEmbed();

		// make sure there are allowed roles
		if (availableRoles === undefined) {
			message.channel.send('There are currently no self-assignable roles.');
			return message.channel.stopTyping();
		}

		// create array from user input
		roleArgs = message.content.match(Constants.cslRegExp);
		roleArgs = roleArgs.map((el: string) => { return el.toString().replace(Constants.destroyRegExp, ''); });

		roleArgs.forEach((el: any) => {
			// search for role
			let options: any = { extract: (r: any) => { return r.name; } };
			let results: any = fuzzy.filter(el, availableRoles, options);

			// check if role is valid
			if (results.length === 0)
				invalidRoles.push(el);

			// destroy role
			if (results.length === 1) {
				// role from result
				role = message.guild.roles.get(results[0].original.id);
				validRoles.push(role);
			}

			// more than one role found
			if (results.length > 1) {
				// check if roleArg is specifically typed
				if (Assignment.isSpecificResult(results, el)) {
					// grab the role to be assigned
					role = message.guild.roles.find('name', Assignment.getSpecificRoleName(results, el));
					validRoles.push(role);
				} else {
					// be more specific
					beMoreSpecific = true;
					message.channel.send(`More than one role found: \`${results.map((r: any) => { return r.string; }).join('`, `')}\`.  Please be more specific.`);
				}
			}
		});

		if (beMoreSpecific)
			return message.channel.stopTyping();

		// remove roles
		validRoles.forEach((el: Role) => { message.guild.member(message.author.id).removeRole(el); });

		// there are no invalid roles or inspecific roles
		if (validRoles.length > 0 && invalidRoles.length === 0 && inspecificRoles.length === 0) {
			message.channel.send(`Successfully removed ${validRoles.join(', ')}.`);
			return message.channel.stopTyping();
		}

		// there are only invalid roles
		if (validRoles.length === 0 && invalidRoles.length > 0 && inspecificRoles.length === 0) {
			message.channel.send(`The following role(s) are invalid: \`${invalidRoles.join('`, `')}\`.`);
			return message.channel.stopTyping();
		}

		// there are only inspecific roles
		if (validRoles.length === 0 && invalidRoles.length === 0 && inspecificRoles.length > 0) {
			message.channel.send(`The following role(s) are inspecific: \`${inspecificRoles.join('`, `')}\`.`);
			return message.channel.stopTyping();
		}

		// there are a mixture of inspecifc and invlaid roles
		if (validRoles.length === 0 && invalidRoles.length > 0 && inspecificRoles.length > 0) {
			// build output embed
			embed
				.setColor(0x206694)
				.setTitle(message.guild.name + ': Roles Update')
				.addField('Inspecific Roles', inspecificRoles.join('\n') ? inspecificRoles.join('\n') : '\u200b', true)
				.addField('Invalid Roles', invalidRoles.join('\n') ? invalidRoles.join('\n') : '\u200b', true);

			// display output embed
			message.channel.send({ embed: embed });
			return message.channel.stopTyping();
		}

		// there are a mixture of valid and invlaid roles
		if (validRoles.length > 0 && invalidRoles.length > 0 && inspecificRoles.length === 0) {
			// build output embed
			embed
				.setColor(0x206694)
				.setTitle(message.guild.name + ': Roles Update')
				.addField('Removed Roles', validRoles.join('\n') ? validRoles.join('\n') : '\u200b', true)
				.addField('Invalid Roles', invalidRoles.join('\n') ? invalidRoles.join('\n') : '\u200b', true);

			// display output embed
			message.channel.send({ embed: embed });
			return message.channel.stopTyping();
		}
	}
}
