import { Command, GuildStorage } from 'yamdbf';
import { Collection, Message, MessageReaction, RichEmbed, User } from 'discord.js';
import Constants from '../../util/Constants';
import Handle from '../../util/Handle';
import Profile from '../../util/Profile';
import * as request from 'request-promise';

export default class Me extends Command {
	public constructor() {
		super({
			name: 'me',
			desc: 'Profile Registration',
			usage: '<prefix>me <Argument>?',
			info: 'Argument information below...\u000d\u000d' +
			'set <Platform> <Handle> : Profile Registration\u000d' +
			'toggle                  : Toggle Main Account\u000d' +
			'flush                   : Flush Profile\u000d\u000d' +
			'*Running the command without an argument returns current profile information.\u000d\u000d' +
			'*Current platforms: xbl, psn.',
			group: 'profile',
			guildOnly: true
		});
	}

	public async action(message: Message, args: Array<string>): Promise<any> {
		// start typing
		message.channel.startTyping();

		// grab profile
		const guildStorage: GuildStorage = this.client.storage.guilds.get(message.guild.id);
		let profile: Profile = await guildStorage.get(message.author.id.toString());

		// profile variable declaration
		let handle: string = '';
		let platform: string = '';

		// error variable declaration
		let error: Boolean = false;
		let errorMessage: string = '';

		// output variable declaration
		const embed: RichEmbed = new RichEmbed();

		switch (args[0]) {
			case 'flush':
				// check if valid profile
				if (profile) {
					// flush profile
					guildStorage.remove(message.author.id.toString());

					// display output
					message.channel.send('Flushed profile settings.');
					return message.channel.stopTyping();
				} else {
					// display output
					message.channel.send('No profile attributes set, nothing to flush.');
					return message.channel.stopTyping();
				}

			case 'set':
				// handle arg
				if (!args[1]) {
					error = true;
					errorMessage += 'Please specify a `Platform`. ';
				}
				if (!args[2]) {
					error = true;
					errorMessage += 'Please specify a `Handle`. ';
				}
				if (args[1] && !Constants.platformRegExp.test(args[1])) {
					error = true;
					errorMessage += 'Please specify a valid `Platform`.';
				}

				if (error) {
					message.channel.send(errorMessage);
					return message.channel.stopTyping();
				}
				if (/pc|ps|psn/i.test(args[1])) {
					if (Constants.psRegExp.test(args[2])) {
						handle = args[2];
						platform = args[1].toLowerCase();
					} else {
						error = true;
						errorMessage += 'Please specify a valid PSN handle. ';
					}
				}
				if (/xbl|xbox/i.test(args[1])) {
					if (Constants.xbRegExp.test(message.content)) {
						handle = message.content.match(Constants.xbRegExp)[1];
						platform = args[1].toLowerCase();
					} else {
						error = true;
						errorMessage += 'Please specify a valid XBL handle. ';
					}
				}
				if (error) {
					message.channel.send(errorMessage);
					return message.channel.stopTyping();
				}

				// does the user have an active Handle?
				let activeHandle: Handle = Profile.getActiveHandle(profile);
				if (activeHandle) {
					// create confirmation filter
					const setFilter: any = (m: Message) => {
						if (m.author.id === message.author.id && m.content.match(/r|a|c/i))
							return true;
					};

					// send confirmation message
					message.channel.send(`You appear to have an active handle already: ` +
						`${activeHandle.tag} on ${activeHandle.platform.toUpperCase()}.\n\n` +
						`[\`R\`]eplace account?\n` +
						`[\`A\`]dd account?\n` +
						`[\`C\`]ancel?`).then(() => {
						// send awaitMessage
						message.channel.awaitMessages(setFilter, {max: 1, time: 20000})
						// user responded
						.then((collected: Collection<string, Message>) => {
							// add alt account
							if (collected.first().content.toLowerCase() === 'a') {
								// check if Handle already exists
								if (profile.handles.find((a: Handle) => a.tag === handle && a.platform === platform))
									return message.channel.send('You already have an alt account with that Handle.');

								// deactivate all Handles
								profile.handles.forEach((el: Handle) => { el.active = false; });

								// add new Handle
								profile.handles.push(new Handle(handle, platform.toLowerCase(), true));

								// save user profile
								guildStorage.set(message.author.id.toString(), profile);

								// build display output
								embed
									.setColor(Profile.getEmbedColor(platform))
									.setAuthor('Profile Registration', message.guild.iconURL)
									.setDescription('Added an alt account with the following information...')
									.addField('Handle', `\`${handle}\`${Constants.spacer}`, true)
									.addField('Platform', `${Profile.getplatformEmoji(platform)}`, true)
									.setFooter('This handle is now your active handle.');

								// display output
								return message.channel.send({ embed: embed });
							}

							// replace existing account
							if (collected.first().content.toLowerCase() === 'r') {
								// find existing Handle
								let index: number = profile.handles.findIndex((a: any) => a.tag === handle);

								// remove Handle
								profile.handles.splice(index, 1);

								// deactivate all Handles
								profile.handles.forEach((el: Handle) => { el.active = false; });

								// add updated Handle
								profile.handles.push(new Handle(handle, platform.toLowerCase(), true));

								// save user profile
								guildStorage.set(message.author.id.toString(), profile);

								// build display output
								embed
									.setColor(Profile.getEmbedColor(platform))
									.setAuthor('Profile Registration', message.guild.iconURL)
									.setDescription('Replaced existing account with the following information...')
									.addField('Handle', `\`${handle}\`${Constants.spacer}`, true)
									.addField('Platform', `${Profile.getplatformEmoji(platform)}`, true)
									.setFooter('This handle is now your active handle.');

								// display output
								return message.channel.send({ embed: embed });
							}

							// cancel the action
							if (collected.first().content.toLowerCase() === 'c') {
								return message.channel.send('Cancelling action.');
							}
						})
						// user did not respond
						.catch(() => {
							// display output
							return message.channel.send('There was no collected message that passed the filter within the time limit!');
						});
					});
					// stop typing
					return message.channel.stopTyping();
				} else {
					// create new profile
					profile = new Profile();

					// add new Handle
					profile.handles = new Array(new Handle(handle, platform.toLowerCase(), true));

					// save user profile
					guildStorage.set(message.author.id.toString(), profile);

					// build display output
					embed
						.setColor(Profile.getEmbedColor(platform))
						.setAuthor('Profile Registration', message.guild.iconURL)
						.setDescription('Creating account with the following information...')
						.addField('Handle', `\`${handle}\`${Constants.spacer}`, true)
						.addField('Platform', `${Profile.getplatformEmoji(platform)}`, true)
						.setFooter('This handle is now your active handle.');

					// display output
					message.channel.send({ embed: embed });
					return message.channel.stopTyping();
				}

			case 'toggle':
				// check if valid profile
				if (profile) {
					let index: number = 0;
					let handles: string = '';
					let info: string = '';

					// create confirmation filter
					const toggleFilter: any = (m: Message) => {
						if (m.author.id === message.author.id && m.content.match(/([0-9])+/i))
							return true;
					};

					// sort, active first
					profile.handles.sort((a: Handle, b: Handle) => { return (a.active === b.active) ? 0 : a.active ? -1 : 1; });

					// create list of handles for display
					for (let x: number = 0; x < profile.handles.length; x++) {
						handles += (x + 1) + `⃣  \`${profile.handles[x].tag}\`${Constants.spacer}\n`;
						info += `\`${Profile.getplatformEmoji(profile.handles[x].platform)}\`\n`;
					}

					// build display output
					embed
						.setColor(Profile.getEmbedColor(profile.handles[index].platform))
						.setAuthor(message.author.username, message.author.avatarURL)
						.addField('Handle', handles, true)
						.addField('Platform', info, true)
						.setFooter(`Which number above would you like to activate?`);

					// display prompt
					message.channel.send({ embed: embed }).then(() => {
						// send awaitMessage
						message.channel.awaitMessages(toggleFilter, {
							max: 1,
							time: 10000
						})
						// user responded
						.then((collected: Collection<string, Message>) => {
							// grab index from response
							index = parseInt(collected.first().content) - 1;

							// make sure it's within range
							if (index > profile.handles.length - 1)
								return message.channel.send('Please respond only one of the numbers listed.');

							// deactivate all Handles
							profile.handles.forEach((el: Handle) => { el.active = false; });

							// activate Handle, based on index
							profile.handles[index].active = true;

							// save user profile
							guildStorage.set(message.author.id.toString(), profile);

							// display output
							return message.channel.send(`Main account updated to **${profile.handles[index].tag}** on ${profile.handles[index].platform.toUpperCase()}.`);
						})
						// user did not respond
						.catch(() => {
							// display output
							return message.channel.send('There was no collected message that passed the filter within the time limit!');
						});
					});
					// stop typing
					return message.channel.stopTyping();
				} else {
					// display output
					message.channel.send('No profile attributes set.');
					return message.channel.stopTyping();
				}

			default:
				// check if valid profile
				if (args[0]) {
					message.channel.send('Invalid argument. See help for this command.');
					return message.channel.stopTyping();
				} else if (profile) {
					// variable declaration
					let tags: string = '';
					let info: string = '';

					// sort, active first
					profile.handles.sort((a, b) => { return (a.active === b.active) ? 0 : a.active ? -1 : 1; });

					// get active Handle
					const index: number = profile.handles.findIndex(a => a.active === true);

					// build output for tags and info
					profile.handles.forEach((el: Handle) => {
						tags += `\`${el.tag}\`${Constants.spacer}\n`;
						info += `${Profile.getplatformEmoji(el.platform)}\n`;
					});

					// build display output
					embed
						.setColor(Profile.getEmbedColor(profile.handles[index].platform))
						.setAuthor(message.author.username, message.author.avatarURL)
						.addField('Handle', tags, true)
						.addField('Platform', info, true)
						.setFooter(`Your current main handle is ${profile.handles[index].tag} on ${profile.handles[index].platform.toUpperCase()}.`);

					// display output
					message.channel.send({ embed: embed });
					return message.channel.stopTyping();
				} else {
					// display output
					message.channel.send('No profile attributes set.');
					return message.channel.stopTyping();
				}
		}
	}
}
