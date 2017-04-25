'use strict';

import * as moment from 'moment';

export default class Misc {
	public static generateRandomURL(): Array<string> {
		// variable declaration
		const now: Date = new Date();
		const min: number = new Date(1995, 5, 16).getTime();
		const max: number = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 18, 59, 59, 999).getTime() - (5 * 60 * 60 * 1000);
		const mMin: number = new Date(1995, 5, 17).getTime();
		const mMax: number = new Date(1995, 5, 19, 23, 59, 59, 999).getTime();

		// grab the random date between the above mins/maxs
		let rDate: number = Math.round(min + Math.random() * (max - min));
		while (rDate >= mMin && rDate <= mMax) {
			rDate = Math.round(min + Math.random() * (max - min));
		}
		const random: Date = new Date(rDate);

		// grab the individual date parts for the url
		const rD: string = (0 + random.getDate().toString()).slice(-2);
		const rM: string = (0 + (random.getMonth() + 1).toString()).slice(-2);
		const rY: string = random.getFullYear().toString();

		// make the date string pretty
		let dateString = moment(rY + '-' + rM + '-' + rD).format('ll');
		dateString = '  --  ' + dateString;

		// return array with url and datestring
		return ['http://apod.nasa.gov/apod/ap' + rY.slice(-2) + rM + rD + '.html', dateString];
	}

	public static pad(n: string): string {
		return (parseInt(n) < 10) ? ('0' + n) : n;
	}
}
