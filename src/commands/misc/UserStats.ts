import { Command } from 'yamdbf';
import { Collection, GuildMember, Message, RichEmbed, Role, User } from 'discord.js';
import Constants from '../../util/Constants';
import * as fuzzy from 'fuzzy';
import * as moment from 'moment';

export default class UserStats extends Command {
	public constructor() {
		super({
			name: 'us',
			desc: 'User Stats',
			usage: '<prefix>us <Argument>?',
			info: 'Argument information below...\u000d\u000d' +
			'@mention : Display user information via @mention\u000d' +
			'username : Display user information via display name',
			group: 'misc',
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		let guildMember: GuildMember;
		let joinDiscord: string = '';
		let joinServer: string = '';
		let userRoles: Collection<string, Role>;
		let status: string = '';

		// grab user information
		if (!args[0])
			guildMember = message.member;
		else {
			if (message.mentions.members.size === 0) {
				// if there was an attempt and args[0] was too short
				if (args[0] && args[0].length < 3)
					return message.channel.send(`Please provide more letters for your search.`);

				// map users
				const users: Array<GuildMember> = message.guild.members.map((member: GuildMember) => member);

				// search for user
				let options: any = { extract: (el: GuildMember) => { return el.displayName; } };
				let results: any = fuzzy.filter(args[0].toString(), users, options);

				if (results.length === 1) {
					guildMember = results[0].original;
				} else
					return message.channel.send(`**${results.length}** users found: \`${results.map((el: any) => { return el.original.displayName; }).join('\`, \`')}\`.  Please be more specific.`);
			} else {
				guildMember = message.mentions.members.first();
			}
		}

		// start typing
		message.channel.startTyping();

		joinDiscord = moment(guildMember.user.createdAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.user.createdAt, 'days') + ' days ago*';
		joinServer = moment(guildMember.joinedAt).format('lll') + '\n*' + moment(new Date()).diff(guildMember.joinedAt, 'days') + ' days ago*';
		userRoles = new Collection(Array.from(guildMember.roles.entries()).sort((a: any, b: any) => b[1].position - a[1].position));
		status = guildMember.user.presence.status;

		// build user role array
		let roles: Array<Role> = userRoles.filter((el: Role) => { if (el.name !== '@everyone' && el.managed === false) return true; }).map((el: Role) => { return el; });
		let rolesString: string = '*none*';

		// make sure roles isn't empty
		if (roles.length > 0)
			rolesString = roles.join(', ');

		// update status string, based on original status
		if (status === 'online')
			status = 'Status: *Online*';
		if (status === 'offline')
			status = 'Status: *Offline*';
		if (status === 'idle')
			status = 'Status: *Idle*';
		if (status === 'dnd')
			status = 'Status: *Do Not Disturb*';

		// build the embed
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.embedColor)
			.setAuthor(guildMember.user.username + '#' + guildMember.user.discriminator, guildMember.user.avatarURL)
			.setDescription(status)
			.addField('Joined Server', joinServer, true)
			.addField('Joined Discord', joinDiscord, true)
			.addField('Roles', rolesString, false)
			.setTimestamp();

		// display stats
		message.channel.send({ embed: embed });
		return message.channel.stopTyping();
	}
}
