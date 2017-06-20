import { Command } from 'yamdbf';
import { Message, RichEmbed } from 'discord.js';
import Comic from '../../util/Comic';
import Constants from '../../util/Constants';
import Misc from '../../util/Misc';
import * as moment from 'moment';
import * as request from 'request-promise';

export default class APoD extends Command {
	public constructor() {
		super({
			name: 'xkcd',
			desc: 'XKCD Comics',
			usage: '<prefix>xkcd <Argument>?',
			info: 'Argument information below...\u000d\u000d' +
			'r	   : Random XKCD Comic\u000d' +
			'1-1800+ : Specific XKCD Comic\u000d\u000d' +
			'*Running the command without an argument returns the most recent XKCD comic.',
			group: 'misc'
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		// variable declaration
		const baseURL: string = 'http://xkcd.com/';
		const xkcdJSON: string = 'info.0.json';

		// show the user we're working
		message.channel.startTyping();

		// max amount of comics
		let max: any = await request({ uri: baseURL + xkcdJSON, json: true });

		if (parseInt(args[0]) > max.num) {
			message.channel.send(`Selection outside of range, please select a number below \`${max.num}\`.`);
			return message.channel.stopTyping();
		}

		// random comic
		let rComic: number = Math.floor((Math.random() * parseInt(max.num)) + 1);

		// url, checks for numbers and 'r'
		let url: string = (/\d+/.test(args[0])) ? baseURL + args[0] + '/' + xkcdJSON : ((args[0] === 'r') ? baseURL + rComic + '/' + xkcdJSON : baseURL + xkcdJSON);

		// request options
		let options: any = { uri: url, json: true };

		// make the request
		request(options)
			.then(async (comic: Comic) => {
				// build the panel embed
				const panelEmbed: RichEmbed = new RichEmbed()
					.setColor(Constants.embedColor)
					.setAuthor(comic.title)
					.setImage(comic.img);

				// build the alt embed
				const altEmbed: RichEmbed = new RichEmbed()
					.setColor(Constants.embedColor)
					.setAuthor(moment(`${comic.year}-${Misc.pad(comic.month)}-${Misc.pad(comic.day)}`).format('LL') + ' #' + comic.num)
					.setDescription(comic.alt);

				// display the embesd
				await message.channel.send({ embed: panelEmbed });
				message.channel.send({ embed: altEmbed });

				// stop working
				return message.channel.stopTyping();
			})
			.catch((err: any) => {
				// log the error
				console.log(err);

				// stop working
				return message.channel.stopTyping();
			});
	}
}
