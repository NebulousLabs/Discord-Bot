import { Command, GuildStorage } from 'yamdbf';
import { GuildMember, Message, RichEmbed, User } from 'discord.js';
import Constants from '../../util/Constants';
import Handle from '../../util/Handle';
import Profile from '../../util/Profile';
import * as fuzzy from 'fuzzy';

export default class HandleSearch extends Command {
	public constructor()	{
		super({
			name: 'hs',
			desc: 'Handle Search',
			usage: '<prefix>hs <Argument>',
			info: 'Argument information below...\u000d\u000d' +
			'@mention : Find a user\'s Handle via Discord @mention\u000d' +
			'username : Find a user\'s Handle via Discord username',
			group: 'search',
			guildOnly: true
		});
	}

	public async action(message: Message, args: Array<string>): Promise<any> {
		// no user specified
		if (!args[0])
			return message.channel.send('Please provide a user to search for.');

		// if there was an attempt, args[0] was too short
		if (args[0] && args[0].length < 3)
			return message.channel.send('Please provide more letters for your search.');

		// show the user we're working
		message.channel.startTyping();

		// grab the storage
		const guildStorage: GuildStorage = this.client.storage.guilds.get(message.guild.id);
		let profile: Profile;
		let tags: string = '';
		let info: string = '';

		// if there was an attempt
		if (args[0]) {
			// if that attempt was a mention
			if (message.mentions.users.size === 1)
				profile = await guildStorage.get(message.mentions.users.first().id);

			// if more than one mention
			if (message.mentions.users.size > 1) {
				message.channel.send('Please specify only one user.');
				return message.channel.stopTyping();
			}

			// if no mentions, plaintext
			if (message.mentions.users.size === 0) {
				// map users
				const users: Array<User> = message.guild.members.map((member: GuildMember) => member.user);

				// search for user
				let options: any = { extract: (el: User) => { return el.username; } };
				let results: any = fuzzy.filter(args[0].toString(), users, options);

				// user found
				if (results.length === 1) {
					// create user variables
					let user: User = results[0].original;
					profile = await guildStorage.get(user.id);

					// null checking
					if (!profile) {
						message.channel.send(`**${user.username}** is not registered with me.`);
						return message.channel.stopTyping();
					}

					// sort, active first
					profile.handles.sort((a: Handle, b: Handle) => { return (a.active === b.active) ? 0 : a.active ? -1 : 1; });

					// get active Handle
					const index: number = profile.handles.findIndex(a => a.active === true);

					// build output for tags and info
					profile.handles.forEach((el: Handle) => {
						tags += `\`${el.tag}\`${Constants.spacerEmoji}\n`;
						info += `${Profile.getplatformEmoji(el.platform)}\n`;
					});

					// build display output
					const embed: RichEmbed = new RichEmbed()
						.setColor(Profile.getEmbedColor(profile.handles[index].platform))
						.setAuthor(user.username, user.avatarURL)
						.addField('Handle', tags, true)
						.addField('Platform', info, true)
						.setFooter(`${user.username}'s current main handle is ${profile.handles[index].tag} on ${profile.handles[index].platform.toUpperCase()}.`);

					// display output
					message.channel.send({ embed: embed });
					return message.channel.stopTyping();
				} else {
					// be more specfic
					if (results.length === 0)
						message.channel.send(`**${results.length}** users found.  Please be more specific.`);
					else
						message.channel.send(`**${results.length}** users found: \`${results.map((el: any) => { return el.original.username; }).join('\`, \`')}\`.  Please be more specific.`);

					return message.channel.stopTyping();
				}
			}
		}
	}
}
