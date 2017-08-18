const config: any = require('../config.json');
export type SiaRole = {
	emoji: string;
	name: string;
}
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

	SiaRoles: SiaRole[];
	serverInvite: string;
};


// tslint:disable-next-line:variable-name
export const Constants: BotConstants = <any> {};

// IDs
Constants.assignmentChannelId = config.ServerData.assignmentChannelId;
Constants.serverId = config.ServerData.serverId;
Constants.modChannelId = config.ServerData.modChannelId;
Constants.logChannelId = config.ServerData.logChannelId;

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

Constants.SiaRoles = [
	{name: 'Contributors', emoji: '<:medal:'},
	{name: 'Developers', emoji: '<:keyboard:>'},
	{name: 'Renting', emoji: '<:hdd:>'},
	{name: 'Hosting', emoji: '<:desktop:>'},
	{name: 'Mining', emoji: '<:hammer_pick:>'},
	{name: 'Obelisk', emoji: '<:obelisk:>'},
	{name: 'Altcoins', emoji: '<:crypto:>'},
	{name: 'Trading', emoji: '<:chart_with_upwards_trend:>'},
	{name: 'Bounties', emoji: '<:moneybag:>'},
	{name: 'Design', emoji: '<:paintbrush:>'},
	{name: 'Marketing', emoji: '<:ear:>'},
	{name: 'Siafunds', emoji: '<:sia:>'},
	{name: 'Twitter Feed', emoji: '<:twitter:>'},
	{name: 'Forum Feed', emoji: '<:envelope_with_arrow:>'},
	{name: 'Bitcoin Talk Feed', emoji: '<:bitcoin:>'},
	{name: 'Reddit Feed', emoji: '<:reddit:>'},
	{name: 'NSFW', emoji: '<:wolf:>'},
];


Constants.serverInvite = 'https://discord.gg/XDfY2bV';

export default Constants;
