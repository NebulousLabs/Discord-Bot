import { Command } from 'yamdbf';
import { Message, RichEmbed, User } from 'discord.js';
import Database from '../../database/Database';

const credentials = require('../../database.json');

export default class Note extends Command {
	private database: Database;

	public constructor() {
		super({
			name: 'note',
			desc: 'Set a note for a user',
			usage: '<prefix>note <Argument>?',
			info: 'Argument information below...\u000d\u000d' +
			'note set <User>             : Sets a note for specified user\u000d' +
			'note history <User>         : Displays note history for specified user\u000d' +
			'note delete <User> <NoteID> : Deletes specific note from specified user',
			group: 'profile'
		});
		this.database = new Database(credentials);
	}

	public async action(message: Message, args: Array<any>): Promise<any> {
		// start typing
		message.channel.startTyping();

		// output variable declaration
		const embed: RichEmbed = new RichEmbed();

		let user: User,
			mentions = message.mentions.users.array();

		if (!mentions.length) {
			message.channel.send('You must specify a user.');
			return message.channel.stopTyping();
		} else if (mentions.length > 1) {
			message.channel.send('Please specify only one user.');
			return message.channel.stopTyping();
		} else {
			user = mentions[0];
		}

		switch (args[0]) {
			case 'history':
				this.database.commands.notes.get(user.id)
					.then(results => {
						if (!results.length) {
							message.channel.send(`There are no notes for ${user.username}.`);
							return message.channel.stopTyping();
						} else {
							let notes: string = '';
							results.forEach((value: any, index: number) => {
								notes += `${index + 1}. ${value.note} (<@${value.author}>)\u000d`;
							});

							embed.addField(`Notes for ${user.username}:`, notes, true);
							message.channel.send({ embed: embed });
							return message.channel.stopTyping();
						}
					})
					.catch(error => {
						console.error(error);
						message.channel.send(`There was an error while fetching the notes for ${user.username}.`);
						return message.channel.stopTyping();
					});
				break;
			case 'set':
				this.database.commands.notes.create(user.id, message.author.id, this.parseNote(args))
					.then(result => {
						message.channel.send(`Successfully stored note for ${user.username}.`);
						return message.channel.stopTyping();
					})
					.catch(error => {
						console.error(error);
						message.channel.send(`There was an error while storing the note for ${user.username}.`);
						return message.channel.stopTyping();
					});
				break;
			case 'delete':
				if (isNaN(args[2])) {
					message.channel.send(`Invalid note specified.`);
					return message.channel.stopTyping();
				}

				this.database.commands.notes.get(user.id)
					.then(results => {
						if (!results.length) {
							message.channel.send(`There are no notes for ${user.username}.`);
							return message.channel.stopTyping();
						} else {
							let noteIndex: number = Number(args[2]);
							if (results.length < noteIndex) {
								message.channel.send(`Invalid note specified.`);
								return message.channel.stopTyping();
							}

							this.database.commands.notes.delete(results[noteIndex - 1].id)
								.then(result => {
									message.channel.send(`Deleted note #${noteIndex} for ${user.username}.`);
									return message.channel.stopTyping();
								})
								.catch(error => {
									console.error(error);
									message.channel.send(`There was an error while deleting a note for ${user.username}.`);
									return message.channel.stopTyping();
								});
						}
					})
					.catch(error => {
						console.error(error);
						message.channel.send(`There was an error while deleting a note for ${user.username}.`);
						return message.channel.stopTyping();
					});
				break;
			default:
				message.channel.send('Invalid argument. See help for this command.');
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
