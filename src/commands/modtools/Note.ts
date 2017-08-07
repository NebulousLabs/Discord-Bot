import { Command, GuildStorage } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
import Database from '../../database/Database';
import Constants from '../../util/Constants';
import * as moment from 'moment';
import * as fuzzy from 'fuzzy';

const credentials = require('../../database.json');
const idRegex: RegExp = /^(?:<@!?)?(\d+)>?$/;

export default class Note extends Command {
	private database: Database;

	public constructor() {
		super({
			name: 'note',
			aliases: ['n'],
			desc: 'Add a note for a user',
			usage: '<prefix>note <Argument>',
			info: 'Argument information below...\n\n' +
			'add <User> <Note>    : Adds a note for user\n' +
			'history <User> <ID>? : Displays note history for user. ID optional\n' +
			'delete <User> <ID>   : Deletes specific note for user\n' +
			'reset <User>         : Deletes all notes for user',
			group: 'modtools',
			guildOnly: true,
			roles: ['The Vanguard', 'Discord Chat Mods', 'Mod Assistant']
		});
	}

	public async action(message: Message, args: Array<any>): Promise<any> {
		// Create DB connection
		this.database = new Database(credentials);

		// Set Mod Roles
		let modRoles: Array<Role> = new Array();
		modRoles[0] = message.guild.roles.find('name', 'The Vanguard');
		modRoles[1] = message.guild.roles.find('name', 'Discord Chat Mods');
		modRoles[2] = message.guild.roles.find('name', 'Mod Assistant');

		let author: GuildMember;
		author = message.member;

		// no user specified
		if (!args[1])
			return message.channel.send('Please provide a user to search for.');

		// if there was an attempt, args[1] was too short
		if (args[1] && args[1].length < 3)
			return message.channel.send('Please provide more letters for your search.');

		// grab the storage
		const guildStorage: GuildStorage = this.client.storage.guilds.get(message.guild.id);
		let user: User;

		// output variable declaration
		const embed: RichEmbed = new RichEmbed();

		// if there was an attempt listing a user
		if (args[1]) {

			// if that attempt was a mention, get very first one
			if (message.mentions.users.size === 1) {
				user = await message.client.fetchUser(message.mentions.users.first().id);

			// if no mentions, plaintext
			} else {
				// Check if it's a user ID first
				if (idRegex.test(args[1])) {
					try { user = await message.client.fetchUser(args[1].match(idRegex)[1]); }
					catch (err) { return message.channel.send(`Could not locate user **${args[1]}** from ID argument.`); }

				// Otherwise do a name search
				} else {
					// map users
					const users: Array<User> = message.guild.members.map((member: GuildMember) => member.user);

					// search for user
					let options: any = { extract: (el: User) => { return el.username; } };
					let results: any = fuzzy.filter(args[1].toString(), users, options);

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

		// start typing
		message.channel.startTyping();

		switch (args[0]) {
			case 'h':
			case 'history':
				if (author.roles.has(modRoles[0].id) || author.roles.has(modRoles[1].id) || author.roles.has(modRoles[2].id)) {
					// If an ID is specified, get that exact note
					if (args[2] && !isNaN(args[2])) {
						this.database.commands.note.getOneNote(args[2], message.guild.id, user.id)
							.then(results => {
								if (!results.length) {
									message.channel.send(`Unable to find Note #${args[2]} for <@${user.id}>.`);
									return message.channel.stopTyping();
								} else {
									embed.setColor(Constants.embedColor);
									embed.setTitle(`Notes for ${user.username}:`);

									results.forEach((value: any, index: number) => {
										let noteDate: string = moment(value.createdAt).format('lll');
										let noteText = value.note;
										let length = 950;
										let trimmedNote = noteText.length > length ?
															noteText.substring(0, length - 3) + '...' :
															noteText;

										embed.addField(`#${value.id} - ${noteDate}`, `${trimmedNote}\n\n-<@${value.modid}>`, false);
									});

									message.channel.send({ embed: embed });
									return message.channel.stopTyping();
								}
							})
							.catch(error => {
								console.error(error);
								message.channel.send(`There was an error while fetching the notes for <@${user.id}>.`);
								return message.channel.stopTyping();
							});

					} else {
						// If no ID specified, pull history as normal.
						this.database.commands.note.getNote(message.guild.id, user.id)
							.then(results => {
								if (!results.length) {
									message.channel.send(`There are no notes for <@${user.id}>.`);
									return message.channel.stopTyping();

								} else {
									embed.setColor(Constants.embedColor);
									embed.setTitle(`Notes for ${user.username}:`);

									results.forEach((value: any, index: number) => {
										let noteDate: string = moment(value.createdAt).format('lll');
										let noteText = value.note;
										let length = 150;
										let trimmedNote = noteText.length > length ?
															noteText.substring(0, length - 3) + '...' :
															noteText;
										noteDate = moment(value.createdAt).format('lll');
										embed.addField(`${value.id} - ${noteDate}`, `${value.note}\n\n-<@${value.modid}>`, false);
									});

									message.channel.send({ embed: embed });
									return message.channel.stopTyping();
								}
							})
							.catch(error => {
								console.error(error);
								message.channel.send(`There was an error while fetching the notes for <@${user.id}>.`);
								return message.channel.stopTyping();
							});
					}
					break;
				} else {
					message.channel.send(`Sorry, but you do not have the role(s) necessary to access this command. Roles required: \`The Vanguard\` or \`Discord Chat Mods\` or \`Mod Assistant\`.`);
					return message.channel.stopTyping();
				}

			case 'a':
			case 'add':
				if (author.roles.has(modRoles[0].id) || author.roles.has(modRoles[1].id) || author.roles.has(modRoles[2].id)) {
					let note: string = '';
					note = this.parseNote(args);
					if (note.length === 0) {
						message.channel.send(`Notes must not be empty. Please specify note text.`);
						return message.channel.stopTyping();
					} else {
						this.database.commands.note.createNote(message.guild.id, message.author.id, user.id, note)
							.then(result => {
								message.channel.send(`Successfully stored note for <@${user.id}>.`);
								return message.channel.stopTyping();
							})
							.catch(error => {
								console.error(error);
								message.channel.send(`There was an error while storing the note for <@${user.id}>.`);
								return message.channel.stopTyping();
							});
						break;
					}
				} else {
					message.channel.send(`Sorry, but you do not have the role(s) necessary to access this command. Roles required: \`The Vanguard\` or \`Discord Chat Mods\` or \`Mod Assistant\`.`);
					return message.channel.stopTyping();
				}

			case 'd':
			case 'delete':
				if (author.roles.has(modRoles[0].id) || author.roles.has(modRoles[1].id)) {
					// create confirmation filter
					const setFilter: any = (m: Message) => {
						if (m.author.id === message.author.id && m.content.match(/y|n/i))
							return true;
					};

					// Check if user has any notes
					if (isNaN(args[2])) {
						message.channel.send(`Invalid note specified. Please specify the ID of the note to delete.`);
						return message.channel.stopTyping();
					}

					this.database.commands.note.getOneNote(args[2], message.guild.id, user.id)
						.then(results => {
							if (!results.length) {
								message.channel.send(`Unable to find Note #${args[2]} for <@${user.id}>. The user may not have any notes or you may not have specified a note within range.`);
								return message.channel.stopTyping();
							} else {

								// send confirmation message
								embed.setColor(Constants.embedColor);
								embed.setTitle(`Are you sure you want to delete this note for ${user.username} (__y__es | __n__o)?`);

								results.forEach((value: any, index: number) => {
									let noteDate: string = moment(value.createdAt).format('lll');
									let noteText = value.note;
									let length = 950;
									let trimmedNote = noteText.length > length ?
														noteText.substring(0, length - 3) + '...' :
														noteText;

									embed.addField(`#${value.id} - ${noteDate}`, `${trimmedNote}\n\n-<@${value.modid}>`, false);
								});

								embed.setFooter(`Respond with (Yes | No) | Will auto cancel in 60 seconds.`);

								message.channel.send({ embed: embed }).then(() => {
									// send awaitMessage
									message.channel.awaitMessages(setFilter, {max: 1, time: 60000})
										// user responded
										.then((collected: Collection<string, Message>) => {
											// yes, delete it
											if (collected.first().content.charAt(0).toLowerCase() === 'y') {
												this.database.commands.note.deleteNote(args[2], message.guild.id, user.id)
													.then(result => {
														message.channel.send(`Deleted note #${args[2]} for <@${user.id}>.`);
														return message.channel.stopTyping();
													})
													.catch(error => {
														console.error(error);
														message.channel.send(`There was an error while deleting the note for <@${user.id}>. Please try again.`);
														return message.channel.stopTyping();
													});
											}

											// no, cancel the action
											if (collected.first().content.charAt(0).toLowerCase() === 'n') {
												message.channel.send('Cancelling action.');
												return message.channel.stopTyping();
											}
										})

										// user did not respond
										.catch(() => {
											// display output
											message.channel.send('No response received after time limit. Please respond quicker.');
											return message.channel.stopTyping();
										});
								});
							}
						})
						.catch(error => {
							console.error(error);
							message.channel.send(`There was an error while processing a note deletion request for <@${user.id}>. Please try again.`);
							return message.channel.stopTyping();
						});
						break;
				} else {
					message.channel.send(`Sorry, but you do not have the role(s) necessary to access this command. Roles required: \`The Vanguard\` or \`Discord Chat Mods\`.`);
					return message.channel.stopTyping();
				}

			case 'r':
			case 'reset':
				if (author.roles.has(modRoles[0].id) || author.roles.has(modRoles[1].id)) {
					// create confirmation filter
					const setFilter: any = (m: Message) => {
						if (m.author.id === message.author.id && m.content.match(/y|n/i))
							return true;
					};

					// Check if user has any notes
					this.database.commands.note.getNote(message.guild.id, user.id)
						.then(results => {
							if (!results.length) {
								message.channel.send(`There are no notes for <@${user.id}>.`);
								return message.channel.stopTyping();
							} else {
								// send confirmation message
								embed.setColor(Constants.embedColor);
								embed.setTitle(`Are you sure you want to delete the notes for ${user.username} (__y__es | __n__o)?`);

								results.forEach((value: any, index: number) => {
									let noteDate: string = moment(value.createdAt).format('lll');
									let noteText = value.note;
									let length = 150;
									let trimmedNote = noteText.length > length ?
														noteText.substring(0, length - 3) + '...' :
														noteText;

									embed.addField(`#${value.id} - ${noteDate}`, `${trimmedNote}\n\n-<@${value.modid}>`, false);
								});

								embed.setFooter(`Respond with (Yes | No) | Will auto cancel in 60 seconds.`);

								message.channel.send({ embed: embed }).then(() => {
									// send awaitMessage
									message.channel.awaitMessages(setFilter, {max: 1, time: 60000})
										// user responded
										.then((collected: Collection<string, Message>) => {
											// yes, delete it
											if (collected.first().content.charAt(0).toLowerCase() === 'y') {
												this.database.commands.note.resetNote(message.guild.id, user.id)
													.then(result => {
														message.channel.send(`Deleted all notes for <@${user.id}>.`);
														return message.channel.stopTyping();
													})
													.catch(error => {
														console.error(error);
														message.channel.send(`There was an error while deleting the notes for <@${user.id}>. Please try again.`);
														return message.channel.stopTyping();
													});
											}

											// no, cancel the action
											if (collected.first().content.charAt(0).toLowerCase() === 'n') {
												message.channel.send('Cancelling action.');
												return message.channel.stopTyping();
											}
										})

										// user did not respond
										.catch(() => {
											// display output
											message.channel.send('No response received after time limit. Please respond quicker.');
											return message.channel.stopTyping();
										});
								});
							}
						})
						.catch(error => {
							console.error(error);
							message.channel.send(`There was an error while processing a note deletion request for <@${user.id}>. Please try again.`);
							return message.channel.stopTyping();
						});
						break;
				} else {
					message.channel.send(`Sorry, but you do not have the role(s) necessary to access this command. Roles required: \`The Vanguard\` or \`Discord Chat Mods\`.`);
					return message.channel.stopTyping();
				}
			default:
				message.channel.send(`Invalid argument. See \`<prefix>help note\` for this command.`);
				return message.channel.stopTyping();
		}
	}

	private parseNote(args: Array<any>): string {
		let text: string = '';
		for (let index = 2; index < args.length; index++) {
			text += `${args[index].trim()} `;
		}
		return text.slice(0, -1);
	}

}
