'use strict';

import { Client, Command } from 'yamdbf';
import { Message, RichEmbed } from 'discord.js';
import Constants from '../../util/Constants';
import Misc from '../../util/Misc';
import * as request from 'request-promise';
import * as cheerio from 'cheerio';

export default class APoD extends Command<Client> {
	public constructor(bot: Client) {
		super(bot, {
			name: 'apod',
			description: 'NASA\'s Astronomy Picture of the Day',
			usage: '<prefix>apod <Argument>?',
			extraHelp: 'Argument information below...\u000d\u000dr : Random APoD\u000d\u000d*Running the command without an argument returns the most recent APoD.',
			group: 'misc'
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		// start typing
		message.channel.startTyping();

		// create apod variables
		const now: Date = new Date();
		let uri: string = 'https://apod.nasa.gov/apod/astropix.html';
		let dateString: string = '';

		// if random
		if (args[0] === 'r') {
			// get random date information
			const randomDetails: Array<string> = Misc.generateRandomURL();
			uri = randomDetails[0];
			dateString = randomDetails[1];
		}

		// prepare for the request
		const options: any = { uri: uri, transform: function (el: any) { return cheerio.load(el); } };

		// make the request
		request(options)
			.then(async ($: any) => {
				// variable declaration
				let noImg: boolean = false;
				let noVideo: boolean = true;
				let mediaEmbed: RichEmbed = new RichEmbed()
					.setColor(Constants.embedColor);

				// grab the important stuff
				const img: string = $('img').attr('src');
				const iFrame: string = $('iframe').attr('src');
				let title: string = $('center + center > b:first-child').text().trim();
				let content: string = `http://apod.nasa.gov/apod/${img}`;
				let desc: string = $('center + center + p').text().trim()
					.replace(/(\s)+/g, ' ')
					.replace(/(\r\n|\n|\r)/gm, '')
					.replace(/(Explanation:)/, '');

			// check for video content
			if (img === undefined) {
				noImg = true;
				if (iFrame !== undefined) {
					noVideo = false;
					if (/https\:\/\/www\.youtube\.com\/embed\/([\w-]{11})/i.test(iFrame)) {
						const id: string = iFrame.match(/https\:\/\/www\.youtube\.com\/embed\/([\w-]{11})/i)[1];
						content = `https://www.youtube.com/embed/${id}`;
					} else
						content = uri;
				}
			}

			// set the imgEmbed title
			title = (title === '') ? 'NASA Astronomy Picture of The Day' : title;
			mediaEmbed.setAuthor(title);

			// no image and no video
			if (noImg && noVideo)
				mediaEmbed.setDescription('*There is no embedable content for this date.*');

			// no image and video
			if (noImg && !noVideo)
				mediaEmbed.setDescription('*There is video content for this date.*\n' + content);

			// image and no video
			if (!noImg && noVideo)
				mediaEmbed.setImage(content);

			// explanation embed
			desc = (desc === '') ? '*There is no explanation for this content.*' : desc;
			let embed: RichEmbed = new RichEmbed()
				.setColor(Constants.embedColor)
				.setDescription(desc)
				.setAuthor('Explanation' + dateString);

			// output the two embeds
			await message.channel.send({ embed: mediaEmbed });
			message.channel.send({ embed: embed });

			// we're done working
			return message.channel.stopTyping();
		})
		.catch(function (err: any) {
			// output error message
			message.channel.send('There was an error retrieving the title and/or the description for this content.');

			// we're done working
			return message.channel.stopTyping();
		});
	}
}
