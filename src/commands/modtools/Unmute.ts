import { Command, GuildStorage, Time, Logger, logger } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role, TextChannel, User } from 'discord.js';
import Constants from '../../util/Constants';
import * as fuzzy from 'fuzzy';
import { SweeperClient } from '../../util/lib/SweeperClient';

const idRegex: RegExp = /^(?:<@!?)?(\d+)>?$/;

export default class Mute extends Command<SweeperClient> {
	@logger private readonly logger: Logger;

	public constructor() {
		super({
			name: 'unmute',
			// aliases: ['um'],
			desc: 'Unmute a user',
			usage: '<prefix>unmute <User>',
			info: 'Removes a mute for specified user.\n\n' +
			'To Mute someone see <prefix>mute',
			group: 'modtools',
			guildOnly: true,
			roles: ['The Vanguard', 'Discord Chat Mods', 'Mod Assistant']
		});
	}

	public async action(message: Message, args: Array<any>): Promise<any> {
		// grab the storage
		const guildStorage: GuildStorage = this.client.storage.guilds.get(message.guild.id);

		let issuer: GuildMember = message.member;
		let user: User;

		// no user specified
		if (!args[0])
			return message.channel.send('Please provide a user to search for.');

		// if there was an attempt, args[0] was too short
		if (args[0] && args[0].length < 3)
			return message.channel.send('Please provide 3 or more letters for your search.');

		// if there was an attempt listing a user
		if (args[0]) {

			// if that attempt was a mention, get very first one
			if (message.mentions.users.size === 1) {
				user = await message.client.fetchUser(message.mentions.users.first().id);

			// if no mentions, plaintext
			} else {
				// Check if it's a user ID first
				if (idRegex.test(args[0])) {
					try { user = await message.client.fetchUser(args[0].match(idRegex)[1]); }
					catch (err) { return message.channel.send(`Could not locate user **${args[0]}** from ID argument.`); }

				// Otherwise do a name search
				} else {
					// map users
					const users: Array<User> = message.guild.members.map((member: GuildMember) => member.user);

					// search for user
					let options: any = { extract: (el: User) => { return el.username; } };
					let results: any = fuzzy.filter(args[0].toString(), users, options);

					// user found
					if (results.length === 1) {
						// create user variables
						user = results[0].original;
					} else {
						// be more specfic
						if (results.length === 0)
							return message.channel.send(`**${results.length}** users found. Please be more specific.`);
						else
							return message.channel.send(`**${results.length}** users found: \`${results.map((el: any) => { return el.original.username; }).join('\`, \`')}\`. Please be more specific. You may need to use a User Mention or use the User ID.`);
					}
				}
			}
		} else {
			return message.channel.send(`No users found. Please specify a user by User Mention, User ID, or Display Name.`);
		}

		if (user) {
			const mutedUser: GuildMember = await message.guild.fetchMember(user);

			if (!mutedUser.roles.has(message.guild.roles.get(await guildStorage.settings.get('mutedrole')).id)) {
				message.channel.send('User does not have the muted role.');
				return message.delete();
			}

			if (user.id === message.author.id || user.id === message.guild.ownerID || user.bot) {
				message.channel.send('You may not use this command on that user.');
				return message.delete();
			}

			this.client.mod.actions.unmute(mutedUser, issuer, message.guild)
				.then(result => {
					message.delete();
					this.logger.log('CMD Unmute', `Unmuted user: '${mutedUser.user.tag}' in '${message.guild.name}'`);
					return user.send(`You have been unmuted on ${message.guild.name}. You may now send messages.`);
				})
				.catch(error => {
					console.error(error);
					this.logger.error('CMD Unmute', `Error unmuting: '${mutedUser.user.tag}' in '${message.guild.name}'`);
					return message.channel.send(`There was an error unmuting: <@${user.id}>. Please try again.`);
				});
		}
	}
}
