'use strict';

import { Client, Command, GuildStorage } from 'yamdbf';
import { Message, RichEmbed, Role } from 'discord.js';
import * as fuzzy from 'fuzzy';
import Assignment from '../../util/Assignment';
import Constants from '../../util/Constants';

export default class DisallowRole extends Command<Client> {
	public constructor(bot: Client) {
		super(bot, {
			name: 'disallow',
			aliases: ['d'],
			description: 'Disallow Role',
			usage: '<prefix>disallow <Argument>\u000d' +
			'	   <prefix>disallow <Argument>, <Argument>, ...\u000d' +
			'	   <prefix>d <Argument>\u000d' +
			'	   <prefix>d <Argument>, <Argument>, ...\u000d',
			extraHelp: 'This command will disallow a specific role to be self-assignable.\u000d\u000d' +
			'Argument information below...\u000d\u000d' +
			'Role Name : The name of the role to be disallowed.\u000d\u000d' +
			'*If Sweeper Bot tells you to be more specific, type the role as if it were case-sensitive. Sweeper Bot will then find your specific role.',
			group: 'assignment',
			roles: ['The Vanguard', 'Moderators'],
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		// make sure a role was specified
		if (args.length === 0)
			return message.channel.send('Please specify a role to disallow.');

		// start typing
		message.channel.startTyping();

		// grab the guild storage, available roles, and server roles
		const guildStorage: GuildStorage = this.client.storage.guilds.get(message.guild.id);
		let availableRoles: Array<any> = await guildStorage.get('Server Roles');

		// create user supplied role vars
		let roleArgs: Array<any> = new Array();
		let role: Role;
		let beMoreSpecific: boolean = false;
		let scrub: Boolean = false;

		// create display vars
		let invalidRoles: Array<string> = new Array();
		let validRoles: Array<Role> = new Array();
		let inspecificRoles: Array<string> = new Array();
		const embed: RichEmbed = new RichEmbed();

		if (Constants.scrubRegExp.test(message.content))
			scrub = true;

		// create array from user input
		roleArgs = message.content.match(Constants.cslRegExp);
		roleArgs = roleArgs.map((el: string) => { return el.toString().replace(Constants.disallowRegExp, ''); });

		roleArgs.forEach((el: string) => {
			// search for role
			let options: any = { extract: (r: any) => { return r.name; } };
			let results: any = fuzzy.filter(el, availableRoles, options);

			// check if role is valid
			if (results.length === 0)
				invalidRoles.push(el);

			// if one role found
			if (results.length === 1) {
				// role from result
				role = message.guild.roles.get(results[0].original.id);

				// remove the role from the allowed list
				availableRoles.splice(Assignment.getRoleToRemove(availableRoles, role.name), 1);

				// add role to valid array
				validRoles.push(role);
			}

			// more than one role found
			if (results.length > 1) {
				// check if roleArg is specifically typed
				if (Assignment.isSpecificResult(results, el)) {
					// role from roleArg
					role = Assignment.getSpecificRole(results, el);

					// remove the role from the allowed list
					availableRoles.splice(Assignment.getRoleToRemove(availableRoles, Assignment.getSpecificRoleName(results, el)), 1);

					// add role to valid array
					validRoles.push(role);
				} else
					// add inspecific results to invalid array
					results.forEach((r: any) => { inspecificRoles.push(r.string); });
			}
		});

		// update roles
		guildStorage.set('Server Roles', availableRoles);

		// there are no invalid roles or inspecific roles
		if (validRoles.length > 0 && invalidRoles.length === 0 && inspecificRoles.length === 0) {
			message.channel.send(`Successfully disallowed ${validRoles.join(', ')}.`);
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
				.setColor(Constants.embedColor)
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
				.setColor(Constants.embedColor)
				.setTitle(message.guild.name + ': Roles Update')
				.addField('Disllowed Roles', validRoles.join('\n') ? validRoles.join('\n') : '\u200b', true)
				.addField('Invalid Roles', invalidRoles.join('\n') ? invalidRoles.join('\n') : '\u200b', true);

			// display output embed
			message.channel.send({ embed: embed });
			return message.channel.stopTyping();
		}
	}
}
