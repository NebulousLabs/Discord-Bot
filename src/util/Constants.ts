export type BotConstants = {
	// id
	id: string;

	// RegExp
	cslRegExp: RegExp;
	platformRegExp: RegExp;
	psRegExp: RegExp;
	xbRegExp: RegExp;

	// embed color
	embedColor: string;

	// misc emoji
	spacerEmoji: string;
	blizzEmjoi: string;
	psEmoji: string;
	xbEmoji: string;
	removeEmoji: string;
};

// tslint:disable-next-line:variable-name
const Constants: BotConstants = <any> {};

// id
Constants.id = '282146039824121858';

// RegExp
Constants.cslRegExp = new RegExp('[^\,\\s][^\,]*[^\,\\s]*', 'ig');
Constants.platformRegExp = new RegExp('(\\bpc\\b)|(\\bpsn\\b)|(\\bps\\b)|(\\bxbl\\b)|(\\bxb\\b)|(\\bxbox\\b)', 'i');
Constants.psRegExp = new RegExp('([A-Za-z0-9\-\_]{3,16})', 'i');
Constants.xbRegExp = new RegExp('(?:.me\\sset\\sxb|.me\\sset\\sxbl|.me\\sset\\sxbox)\\s([A-Za-z0-9\-\_\\s]{1,15})', 'i');

// embed color
Constants.embedColor = '0xff8c00';

// misc emoji, prod
Constants.spacerEmoji = ':spacer:328352361569583105';
Constants.blizzEmjoi = ':blizz:328322843227979778';
Constants.psEmoji = ':ps:328322843198881792';
Constants.xbEmoji = ':xb:328322843798405133';

// misc emoji, dev
// Constants.spacerEmoji = '<:spacer:309335739882274827>';
// Constants.blizzEmjoi = '<:blizz:328342096551608320>';
// Constants.psEmoji = '<:ps:328342095892971530>';
// Constants.xbEmoji = '<:xb:328342096564191242>';

export default Constants;
