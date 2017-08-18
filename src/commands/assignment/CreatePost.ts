import { Command, GuildStorage } from 'yamdbf';
import { GuildMember, Message, RichEmbed, TextChannel, User, Emoji } from 'discord.js';
import { Constants, SiaRole } from '../../util/Constants';

export default class CreatePost extends Command {
	public constructor() {
		super({
			name: 'create',
			desc: 'Create Role Reaction Post',
			usage: '<prefix>create <Argument>',
			info: 'Creates message that users will react to in order to assign roles. ' +
			'Argument information below...\n\n' +
			'sia_role  : Creates sia role post\n',
			group: 'assignment',
			roles: ['admin']
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		if (!(<TextChannel> message.channel).permissionsFor(message.author).has('SEND_MESSAGES'))
			return message.author.send(`I can't create messages in that channel.`);

		const embed: RichEmbed = new RichEmbed();
		let guildStorage: GuildStorage = this.client.storage.guilds.get(message.guild.id);

		switch (args[0]) {
			case 'sia_role': {
					let text = Constants.PostText;

					// let emj = new Emoji(this.client)
					const reactionMessage: Message = <Message> await message.channel.sendMessage(text);
					
					for (let role of Constants.SiaRoles) {
						await reactionMessage.react(role.emoji.replace('<', '').replace('>', '')).then(null, function(reason) {
							console.log(reason);
							console.log(role.emoji);
						});
					}

					guildStorage.set('Role Reaction Message', reactionMessage.id.toString());
					break;
				}
		}
	}
}
