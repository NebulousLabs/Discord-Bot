// Note: ModManager and and a few related aspects have come from https://github.com/zajrik/modbot

import { Command, GuildStorage, Logger, logger } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, TextChannel, User } from 'discord.js';
import Constants from '../../util/Constants';
import * as fuzzy from 'fuzzy';
import { SweeperClient } from '../../util/lib/SweeperClient';

import { prompt, PromptResult } from '../../lib/Util';

const idRegex: RegExp = /^(?:<@!?)?(\d+)>?$/;

export default class Mute extends Command<SweeperClient> {
	@logger private readonly logger: Logger;

	public constructor() {
		super({
			name: 'kick',
			aliases: ['k'],
			desc: 'Kick a user from the server',
			usage: '<prefix>kick <User> <Reason>?',
			info: 'If no reason specified default values will be used. ' +
			'The <Reason> is both sent to the user and to our logs.',
			group: 'modtools',
			guildOnly: true,
			roles: ['admin']
		});
	}

	public async action(message: Message, args: Array<any>): Promise<any> {
		let moderator: GuildMember = message.member;
		let user: User;

		// no user specified
		if (!args[0])
			return message.channel.send('Please provide a user to search for.');

		// if there was an attempt, args[0] was too short
		if (args[0] && args[0].length < 3)
			return message.channel.send('Please provide 3 or more letters for your search. For help see \`<prefix>help mute\`');

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
			if (user.id === message.author.id || user.id === message.guild.ownerID || user.bot) {
				message.channel.send('You may not use this command on that user.');
				return message.delete();
			}

			// Set default info
			let note: string = '';
			note = this.parseNote(args);
			if (note.length === 0) { note = 'Please be kind to each other and read our rules in #rules-and-info.'; }

			let embed: RichEmbed = new RichEmbed();
			// If message sent from a non-mod channel then show minimal info
			if (message.channel.id !== Constants.modChannelId) {
				// Delete calling message immediately
				message.delete();

				// Confirm action
				embed.setColor(Constants.kickEmbedColor);
				embed.setDescription(`_<This info is redacted. To see full info use in the mod channel>_`);
			} else {
				// Show full info since it was sent from mod channel
				embed = await this.client.mod.actions.getHistory(user, message.guild);
				embed.setColor(Constants.kickEmbedColor);
				embed.setDescription(`**Kick Reason:** ${note}`);
			}

			const [result, ask, confirmation]: [PromptResult, Message, Message] = <[PromptResult, Message, Message]> await prompt(message,
				'Are you sure you want to issue this action? (__y__es | __n__o)',
				/^(?:yes|y)$/i, /^(?:no|n)$/i, { embed });

			// If message sent from a non-mod channel then delete the mod messages
			if (ask.channel.id !== Constants.modChannelId) {
				// Delete the prompt messages
				ask.delete();
				confirmation.delete();
			}

			if (result === PromptResult.TIMEOUT) return message.channel.send('Command timed out, aborting action.');
			if (result === PromptResult.FAILURE) return message.channel.send('Okay, aborting action.');

			// If mod confirmed action, then perform action
			try {
				const gmUser: GuildMember = await message.guild.fetchMember(user);
				await user.send(`You have been kicked from **${message.guild.name}**.\n\n**A message from the mods:**\n\n"${note}"`)
					.then((res) => {
						// Inform in chat that the warn was success, wait a few sec then delete that success msg
						this.logger.log('CMD Kick', `Informed user of action: '${user.tag}' in '${message.guild.name}'`);
					})
					.catch((err) => {
						const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
						modChannel.send(`There was an error informing ${user.tag} of their kick. Their DMs may be disabled or they may not share a server with the bot.\n\n**Error:**\n${err}`);
						return this.logger.log('CMD Kick', `Unable to inform user of action: '${user.tag}' in '${message.guild.name}'`);
					});

				// If message sent in the mod channel, then give full details, otherwise be vague
				let action: Message;
				if (message.channel.id === Constants.modChannelId) {
					action = <Message> await message.channel.send(`kicking ${user.tag}...`);
				} else {
					action = <Message> await message.channel.send(`Attempting action...`);
				}

				this.client.mod.actions.kick(gmUser, moderator, message.guild, note);
				this.logger.log('CMD Kick', `Kicked user: '${user.tag}' from '${message.guild.name}'`);

				// If message sent in the mod channel, then give full details, otherwise be vague
				if (message.channel.id === Constants.modChannelId) {
					action.edit(`Successfully kicked ${user.tag}.`);
				} else {
					action.edit(`That action was successful.`);
					await new Promise((r: any) => setTimeout(r, 5000));
					action.delete();
				}

			} catch (err) {
				const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
				modChannel.send(`There was an error in ${user.tag}'s kicking. Please try again.\n\n**Error:**\n${err}`);
				return this.logger.log('CMD Kick', `Unable to kick user: '${user.tag}' from '${message.guild.name}'. Error logging to DB/Modlogs channel.`);
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
