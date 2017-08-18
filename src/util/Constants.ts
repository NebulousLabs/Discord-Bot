const config: any = require('../config.json');
export type SiaRole = {
	emoji: string;
	display_name: string;
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
	PostText: string;
	serverInvite: string;

	reportError: (err: any) => void;
};


// tslint:disable-next-line:variable-name
export const Constants: BotConstants = <any>{};

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

	{
		display_name: 'Renting',
		emoji: '<:hdd:347884377822330890>',
		name: 'renting',
	},

	{ display_name: 'Hosting', emoji: '<:SiaHost:348149962061774858>', name: 'hosting' },
	{ display_name: 'Mining', emoji: '<:SiaMine:348150875149303808>', name: 'mining' },
	{ display_name: 'Obelisk', emoji: '<:obelisk:347884215859150860>', name: 'obelisk' },

	{
		display_name: 'Contributors',
		emoji: '<:SiaMedal:348147007623397376>',
		name: 'contributors',
	},
	{
		display_name: 'Developers',
		emoji: '<:SiaDev:348157143465328641>',
		name: 'developers',
	},

	{ display_name: 'Bounties', emoji: '<:SiaBounty:348152613277138945>', name: 'bounties' },
	{ display_name: 'Design', emoji: '<:SiaDesign:348153430998777858>', name: 'design' },

	{ display_name: 'Trading', emoji: '<:SiaTrade:348149332450607105>', name: 'trading' },
	{ display_name: 'Altcoins', emoji: '<:crypto:347880295183155201>', name: 'altcoins' },
	{ display_name: 'Blockchain Tech', emoji: '<:SiaChain:348151725686784000>', name: 'blockchain' },
	{ display_name: 'Siafunds', emoji: '<:sia:344448389024579585>', name: 'siafunds' },

	{ display_name: 'Twitter Feed', emoji: '<:twitter:347879938545680384>', name: 'twitter' },
	{ display_name: 'Forum Feed', emoji: '<:SiaEnvelope:348154353850384394>', name: 'forum' },
	{ display_name: 'Bitcoin Talk Feed', emoji: '<:bitcoin:347879601730748426>', name: 'bitcoin talk' },
	{ display_name: 'Reddit Feed', emoji: '<:reddit:347880473738870787>', name: 'reddit' },

];


Constants.serverInvite = 'https://discord.gg/XDfY2bV';

Constants.reportError = function (err) {
	console.log('DANGER WILL ROBINSON');
	console.log(err);
}

Constants.PostText = `
**Renting** <:hdd:347884377822330890>

**Hosting** <:SiaHost:348149962061774858> 

**Mining** <:SiaMine:348150875149303808>

**Obelisk** <:obelisk:347884215859150860>

---

**Contributors** <:SiaMedal:348147007623397376> 

**Developers** <:SiaDev:348157143465328641>

**Bounties** <:SiaBounty:348152613277138945>

**Design** <:SiaDesign:348153430998777858>

---

**Trading** <:SiaTrade:348149332450607105> 

**Altcoins** <:crypto:347880295183155201>

**Blockchain Tech** <:SiaChain:348151725686784000>

**Siafunds** <:sia:344448389024579585>

---

**Twitter Feed** <:twitter:347879938545680384>

**Forum Feed** <:SiaEnvelope:348154353850384394>

**Bitcoin Talk Feed** <:bitcoin:347879601730748426> 

**Reddit Feed** <:reddit:347880473738870787>

---
`;

export default Constants;
