export type BotConstants = {
	// ID
	assignmentChannelId: string;
	serverId: string;
	modChannelId: string;
	logChannelId: string;

	// RegExp
	platformRegExp: RegExp;
	pcRegExp: RegExp;
	psRegExp: RegExp;
	xbRegExp: RegExp;

	// Embed color
	embedColor: string;
	muteEmbedColor: string;
	warnEmbedColor: string;
	banEmbedColor: string;
	kickEmbedColor: string;

	// Misc emoji
	spacerEmoji: string;
	// Platforms
	blizzEmjoi: string;
	psEmoji: string;
	xbEmoji: string;
	removeEmoji: string;
	// Spoiler Channel access
	D2Emoji: string;
	// Faction Wars
	DOEmoji: string;
	FWCEmoji: string;
	NMEmoji: string;
};

// tslint:disable-next-line:variable-name
const Constants: BotConstants = <any> {};

// IDs, Dev
// Constants.assignmentChannelId = '333685669602000896';
// Constants.serverId = '305133671776649216';
// Constants.modChannelId = '334461385713123328';
// Constants.logChannelId = '334461385713123328';

// IDs, Prod
Constants.assignmentChannelId = '224197509738790922';
Constants.serverId = '157728722999443456';
Constants.modChannelId = '255099898897104908';
Constants.logChannelId = '322490463770640385';

// RegExp
Constants.platformRegExp = new RegExp('(\\bpc\\b)|(\\bpsn\\b)|(\\bps\\b)|(\\bxbl\\b)|(\\bxb\\b)|(\\bxbox\\b)', 'i');
Constants.pcRegExp = new RegExp('([A-Za-z0-9\-\_\#]{3,16})', 'i');
Constants.psRegExp = new RegExp('([A-Za-z0-9\-\_]{3,16})', 'i');
Constants.xbRegExp = new RegExp('(?:.me\\sset\\sxb|.me\\sset\\sxbl|.me\\sset\\sxbox)\\s([A-Za-z0-9\-\_\\s]{1,15})', 'i');

// Embed color
Constants.embedColor = '0xFF8C00';
Constants.muteEmbedColor = '0xFFCC00';
Constants.warnEmbedColor = '0xFFEF00';
Constants.banEmbedColor = '0xE50000';
Constants.kickEmbedColor = '0x0083FF';

// Misc emoji, prod
Constants.spacerEmoji = '<:spacer:328352361569583105>';
// Platforms
Constants.blizzEmjoi = '<:blizz:328322843227979778>';
Constants.psEmoji = '<:ps:328322843198881792>';
Constants.xbEmoji = '<:xb:328322843798405133>';
// Spoiler Channel access
Constants.D2Emoji = '<:D2:336634217712582656>';
// Faction Wars emojis
Constants.DOEmoji = '<:do:247889245333618688>';
Constants.FWCEmoji = '<:fwc:247889245337944064>';
Constants.NMEmoji = '<:nm:247889245421699082>';

export default Constants;
