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
			name: 'unban',
			aliases: ['ub'],
			desc: 'Remove a users ban',
			usage: '<prefix>unban <UserID> <Reason>?',
			info: 'Only a User ID is accepted. If reason specified that will be logged internally.\n\n' +
				'A default reason to follow our rules will be sent to the user.\n\n' +
				'To ban someone see <prefix>ban',
			group: 'modtools',
			guildOnly: true,
			roles: ['The Vanguard', 'Discord Chat Mods']
		});
	}

	public async action(message: Message, args: Array<any>): Promise<any> {
		let moderator: GuildMember = message.member;
		let user: User;

		// no user specified
		if (!args[0])
			return message.channel.send('Please provide a user ID.');

		// if there was an attempt, args[0] was too short
		if (args[0] && args[0].length < 3)
			return message.channel.send('Please provide 3 or more letters for your search. For help see help command.');

		// if there was an attempt listing a user
		if (args[0]) {
			// Check if it's a user ID
			if (idRegex.test(args[0])) {
				try { user = await message.client.fetchUser(args[0].match(idRegex)[0]); }
				catch (err) { return message.channel.send(`Could not locate user **${args[0]}** from ID argument.`); }
			}
		} else {
			return message.channel.send(`No users found. Please specify a User ID.`);
		}

		if (user) {
			if (user.id === message.author.id || user.id === message.guild.ownerID || user.bot) {
				message.channel.send('You may not use this command on that user.');
				return message.delete();
			}

			let banned: boolean = await message.guild.fetchBans().then(bans => {
				let users = bans.filter(r => r === user);
				if (!users.first()) {
					message.channel.send('User is not banned.');
					message.delete();
					return Promise.resolve(false);
				} else {
					return Promise.resolve(true);
				}
			});

			if (!banned) { return; }

			// Delete calling message immediately only if sent from non-mod channel
			if (message.channel.id !== Constants.modChannelId) {
				message.delete();
			}

			// Set default info
			let note: string = '';
			const unbanMsg: string = 'Please be kind to each other and read our rules in #rules-and-info.';
			note = this.parseNote(args);
			if (note.length === 0) { note = 'Please be kind to each other and read our rules in #rules-and-info.'; }

			// Confirm unban action
			let embed: RichEmbed = new RichEmbed();
			embed = await this.client.mod.actions.getHistory(user, message.guild);
			// embed.setColor(Constants.banEmbedColor);
			embed.setDescription(`**Unan Reason:** ${note}`);

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

			// If mod confirmed ban, then perform ban action
			try {
				await user.send(`Your ban has been removed on **${message.guild.name}**.\n\n**A message from the mods:**\n\n"${unbanMsg}"\n\nYou may rejoin with this link: https://discord.gg/XDfY2bV`)
					.then((res) => {
						// Inform in chat that the warn was success, wait a few sec then delete that success msg
						this.logger.log('CMD Unban', `Informed user of ban removal: '${user.tag}' in '${message.guild.name}'`);
					})
					.catch((err) => {
						const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
						modChannel.send(`There was an error informing ${user.tag} their ban has been removed.\n\n**Error:**\n${err}`);
						return this.logger.log('CMD Unban', `Unable to inform user their ban is removed: '${user.tag}' in '${message.guild.name}'`);
					});

				// If message sent in the mod channel, then give full details, otherwise be vague
				let unbanning: Message;
				if (message.channel.id === Constants.modChannelId) {
					unbanning = <Message> await message.channel.send(`Removing ban for ${user.tag}...`);
				} else {
					unbanning = <Message> await message.channel.send(`Attempting action...`);
				}

				this.client.mod.actions.unban(user, moderator, message.guild, note);
				this.logger.log('CMD Unban', `Removed ban for user: '${user.tag}' from '${message.guild.name}'`);

				// If message sent in the mod channel, then give full details, otherwise be vague
				if (message.channel.id === Constants.modChannelId) {
					unbanning.edit(`Successfully removed ban for ${user.tag}.`);
				} else {
					unbanning.edit(`That action was successful.`);
					await new Promise((r: any) => setTimeout(r, 5000));
					unbanning.delete();
				}

			} catch (err) {
				const modChannel: TextChannel = <TextChannel> message.guild.channels.get(Constants.modChannelId);
				modChannel.send(`There was an error in ${user.tag}'s banning. Please try again.\n\n**Error:**\n${err}`);
				return this.logger.log('CMD Unban', `Unable to remove ban for user: '${user.tag}' from '${message.guild.name}'. Error logging to DB/Modlogs channel.`);
			}

		} else {
			return message.channel.send('Unable to fetchMember for the user. Try using the User ID instead.');
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
