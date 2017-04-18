'use strict';
import { Client, Command } from 'yamdbf';
import { Message } from 'discord.js';

export default class Example extends Command<Client>
{
	public constructor(bot: Client)
	{
		super(bot, {
			name: 'yo',
			description: 'Example Command',
			usage: '<prefix>yo',
			extraHelp: 'This is an example command.'
		});
	}

	public async action(message: Message, args: string[]): Promise<any>
	{
		message.channel.sendMessage('What\'s up!');
	}
}
