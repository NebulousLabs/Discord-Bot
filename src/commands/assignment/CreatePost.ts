import { Command, GuildStorage } from 'yamdbf';
import { GuildMember, Message, RichEmbed, TextChannel, User } from 'discord.js';
import Constants from '../../util/Constants';

export default class CreatePost extends Command {
	public constructor() {
		super({
			name: 'create',
			desc: 'Create Role Reaction Post',
			usage: '<prefix>create <Argument>',
			info: 'Creates message tht users will react to in order to assign roles. ' +
			'Argument information below...\n\n' +
			'platform : Creates platform assignment post.\n' +
			'spoiler  : Creates spoiler channel access post\n',
			group: 'assignment',
			guildOnly: true,
			roles: ['The Vanguard', 'Discord Chat Mods']
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		if (!(<TextChannel> message.channel).permissionsFor(message.author).has('SEND_MESSAGES'))
			return message.author.send(`I can't create messages in that channel.`);

		const embed: RichEmbed = new RichEmbed();
		let guildStorage: GuildStorage = this.client.storage.guilds.get(message.guild.id);

		switch (args[0]) {
			case 'platform': {
					embed.setColor(Constants.embedColor);
					embed.setTitle(`Role Assignment`);
					embed.setDescription(`React with each of the platforms you will be playing Destiny on by clicking on the corresponding platform icon below.`);

					const reactionMessage: Message = <Message> await message.channel.send({ embed });

					await reactionMessage.react(Constants.blizzEmjoi.replace('<', '').replace('>', ''));
					await reactionMessage.react(Constants.psEmoji.replace('<', '').replace('>', ''));
					await reactionMessage.react(Constants.xbEmoji.replace('<', '').replace('>', ''));

					guildStorage.set('Role Reaction Message', reactionMessage.id.toString());
					break;
				}

			case 'spoiler': {
					embed.setColor(Constants.embedColor);
					embed.setTitle(`Spoilers Enabled Access`);
					embed.setDescription(`React below to enable access to the Destiny 2 Spoilers Channel.`);

					const reactionMessage: Message = <Message> await message.channel.send({ embed });

					await reactionMessage.react(Constants.D2Emoji.replace('<', '').replace('>', ''));

					guildStorage.set('Spoiler Reaction Message', reactionMessage.id.toString());
					break;
				}
		}
	}
}
