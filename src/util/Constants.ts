'use strict';

export type BotConstants = {
	// RegExp
	allowRegExp: RegExp,
	cslRegExp: RegExp,
	destroyRegExp: RegExp,
	disallowRegExp: RegExp,
	getRegExp: RegExp,
	platformRegExp: RegExp,
	psRegExp: RegExp,
	scrubRegExp: RegExp,
	xbRegExp: RegExp
};

// tslint:disable-next-line:variable-name
const Constants: BotConstants = <any> {};

// RegExp
Constants.allowRegExp = new RegExp('\.allow\\s|\.a\\s', 'i');
Constants.cslRegExp = new RegExp('[^\,\\s][^\,]*[^\,\\s]*', 'ig');
Constants.destroyRegExp = new RegExp('\.dr\\s', 'i');
Constants.disallowRegExp = new RegExp('\.disallow\\s|\.d\\s', 'i');
Constants.getRegExp = new RegExp('\.gr\\s', 'i');
Constants.platformRegExp = new RegExp('(\\bpc\\b)|(\\bpsn\\b)|(\\bxbl\\b)', 'i');
Constants.psRegExp = new RegExp('([A-Za-z0-9\-\_]{3,16})', 'i');
Constants.scrubRegExp = new RegExp('(?:-s)', 'ig');
Constants.xbRegExp = new RegExp('(?:.me set xbl)\\s([A-Za-z0-9\-\_\\s]{1,15})', 'i');

export default Constants;
