import { Command, GuildStorage, Time, Logger, logger, Message } from 'yamdbf';
import { Collection, GuildMember, RichEmbed, Role, TextChannel, User } from 'discord.js';
import Constants from '../../util/Constants';
import * as fuzzy from 'fuzzy';
import { SweeperClient } from '../../util/lib/SweeperClient';

const idRegex: RegExp = /^(?:<@!?)?(\d+)>?$/;

export default class Mute extends Command<SweeperClient> {
	@logger private readonly logger: Logger;

	public constructor() {
		super({
			name: 'warn',
			aliases: ['w'],
			desc: 'Issue a warning to a user.',
			usage: '<prefix>warn <User> <Reason>?',
			info: 'If no reason specified default value will be used.',
			group: 'modtools',
			guildOnly: true,
			roles: ['admin']
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
			return message.channel.send('Please provide 3 or more letters for your search. See help for details.');

		// if there was an attempt listing a user
		if (args[0]) {

			// if that attempt was a mention, get very first one
			if (message.mentions.users.size === 1) {
				user = await message.client.fetchUser(message.mentions.users.first().id);

			// if no mentions, plaintext
			} else {
				// Check if it's a user ID first
				if (idRegex.test(args[0])) {
					try { user = await message.client.fetchUser(args[0].match(idRegex)[0]); }
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
			// Set note info
			let note: string = '';
			note = this.parseNote(args);
			if (note.length === 0) { note = 'Please be kind to each other and read our rules in #rules-and-info.'; }

			if (user.id === message.author.id || user.id === message.guild.ownerID || user.bot) {
				message.channel.send('You may not use this command on that user.');
				return message.delete();
			}

			const gmUser: GuildMember = await message.guild.fetchMember(user);

			// Delete calling message immediately only if sent from non-mod channel
			if (message.channel.id !== Constants.modChannelId) {
				message.delete();
			}

			// Log warning to database & logs channel
			try {
				this.client.mod.actions.warn(gmUser, issuer, message.guild, note);
			} catch (err) {
				const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
				modChannel.send(`There was an error logging to the database/log channel for ${gmUser.user.tag}'s warning. Please try again.\n\n**Error:**\n${err}`);
				return this.logger.log('CMD Warn', `Unable to warn user: '${gmUser.user.tag}' in '${message.guild.name}'. Error logging to DB/Modlogs channel.`);
			}

			try {
				await gmUser.send(`You have been warned on **${message.guild.name}**.\n\n**A message from the mods:**\n\n"${note}"`)
					.then((res) => {
						// Inform in chat that the warn was success, wait a few sec then delete that success msg
						this.logger.log('CMD Warn', `Warned user: '${gmUser.user.tag}' in '${message.guild.name}'`);
					})
					.catch((err) => {
						const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
						modChannel.send(`There was an error informing ${gmUser.user.tag} of their warning. Their DMs may be disabled.\n\n**Error:**\n${err}`);
						this.logger.log('CMD Warn', `Unable to warn user: '${gmUser.user.tag}' in '${message.guild.name}'`);
						throw new Error(err);
					});

				let msgSuccess: Message;
				msgSuccess = <Message> await message.channel.send('That action was successful.');
				if (msgSuccess && (message.channel.id !== Constants.modChannelId)) {
					await new Promise((r: any) => setTimeout(r, 5000));
					return msgSuccess.delete();
				}

			} catch (err) {
				return;
			}

		} else {
			return message.channel.send('Unable to fetchMember for the user. Is the user still in the server?');
		}
	}

	private parseNote(args: Array<any>): string {
		let text: string = '';
		for (let index: number = 1; index < args.length; index++) {
			text += `${args[index].trim()} `;
		}
		return text.slice(0, -1);
	}
}
