import { Command, Message, Middleware, CommandDecorators, Logger, logger } from 'yamdbf';
import { SweeperClient } from '../../util/lib/SweeperClient';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class Clear extends Command<SweeperClient> {
	@logger private readonly logger: Logger;

	public constructor() {
		super({
			name: 'clear',
			aliases: ['purge'],
			desc: 'Removes the last <quantity> of messages from the channel.',
			usage: '<prefix>clear <quantity>',
			info: 'Can clear up to 14 days of recent messages.',
			group: 'modtools',
			guildOnly: true,
			roles: ['The Vanguard', 'Discord Chat Mods']
		});
	}

	@using(resolve('quantity: Number'))
	@using(expect('quantity: Number'))
	public async action(message: Message, [quantity]: [int]): Promise<any> {
		if (!quantity || quantity < 2)
			return message.channel.send('You must enter 2 or more messages to remove.');

		const totalQuantity: number = quantity;

		while (quantity > 100) {
			quantity -= 100;
			await message.channel.bulkDelete(100);
		}
		await message.channel.bulkDelete(quantity);

		return this.logger.info('CMD Clear', `Cleared ${totalQuantity} messages. Requested by: ${message.member.user.tag}`);
	}
}
