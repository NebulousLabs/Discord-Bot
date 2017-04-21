'use strict';

export type BotConstants = {
	// RegExp
	allowRegExp: RegExp,
	cslRegExp: RegExp,
	destroyRegExp: RegExp,
	disallowRegExp: RegExp,
	getRegExp: RegExp,
	scrubRegExp: RegExp,
};

// tslint:disable-next-line:variable-name
const Constants: BotConstants = <any> {};

// RegExp
Constants.allowRegExp = new RegExp('\.allow\\s|\.a\\s', 'i');
Constants.cslRegExp = new RegExp('[^\,\\s][^\,]*[^\,\\s]*', 'ig');
Constants.destroyRegExp = new RegExp('\.dr\\s', 'i');
Constants.disallowRegExp = new RegExp('\.disallow\\s|\.d\\s', 'i');
Constants.getRegExp = new RegExp('\.gr\\s', 'i');
Constants.scrubRegExp = new RegExp('(?:-s)', 'ig');

export default Constants;
