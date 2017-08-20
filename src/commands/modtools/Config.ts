import { Command, GuildStorage } from 'yamdbf';
import { Message, Role, TextChannel } from 'discord.js';

export default class Config extends Command {
	public constructor() {
		super({
			name: 'config',
			desc: 'Manage the bot configs',
			usage: '<prefix>config <Argument>',
			info: 'Configures various settings in the bot\n\n' +
			'mute : Sets the role for Muted Users\n',
			group: 'modtools',
			guildOnly: true,
			roles: ['admin']
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		if (!(<TextChannel> message.channel).permissionsFor(message.author).has('SEND_MESSAGES'))
			return message.author.send(`I can't create messages in that channel.`);

		const guildStorage: GuildStorage = this.client.storage.guilds.get(message.guild.id);

		switch (args[0]) {
			case 'mute':
					// Get muted roles
					if (args[1]) {
						try {
							let mutedRole: Role = message.guild.roles.find('name', args[1]);
							guildStorage.settings.set('mutedrole', mutedRole.id);
							return message.channel.send(`Successfully set the \`muted\` role to <@&${mutedRole.id}>`);
						}
						catch (err) { return message.channel.send(`Unable to locate role specified. Please try using Exact Name match.`); }

					} else { return message.channel.send(`Please specify a role. Please try using Exact Name match.`); }
		}
	}
}
