import { GuildMember, Guild, RichEmbed, User, TextChannel } from 'discord.js';
import { GuildStorage, Logger, logger } from 'yamdbf';
import { SweeperClient } from '../../util/lib/SweeperClient';
import Constants from '../../util/Constants';

/**
 * Contains methods for taking moderation action
 */
export class Actions
{
	@logger private readonly logger: Logger;
	private _client: SweeperClient;
	public constructor(client: SweeperClient)
	{
		this._client = client;
	}

	/**
	 * Increment a user's warnings
	 */
	public async warn(member: GuildMember, guild: Guild): Promise<GuildMember>
	{
		return member;
	}

	/**
	 * Mute a user in a guild
	 */
	public async mute(mutedUser: GuildMember, issuer: GuildMember, guild: Guild, muteTimeHUMN: string, note: string): Promise<GuildMember>
	{
		this._client.mod.managers.mute.set(mutedUser);

		const logChannel: TextChannel = <TextChannel> guild.channels.get(Constants.logChannelId);
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.muteEmbedColor)
			.setAuthor(issuer.user.tag, issuer.user.avatarURL)
			.setDescription(`**Member:** ${mutedUser.user.tag} (${mutedUser.user.id})\n`
				+ `**Action:** Mute\n`
				+ `**Length:** ${muteTimeHUMN}\n`
				+ `**Reason:** ${note}`)
			.setTimestamp();
		logChannel.send({ embed: embed });

		this._client.database.commands.mute.add(guild.id, issuer.id, mutedUser.id, muteTimeHUMN, note);

		const storage: GuildStorage = this._client.storage.guilds.get(guild.id);
		return await mutedUser.addRoles([guild.roles.get(await storage.settings.get('mutedrole'))]);
	}

	/**
	 * Restart a mute, setting a new duration and timestamp
	 */
	public async setMuteDuration(member: GuildMember, guild: Guild, duration: int): Promise<void>
	{
		const user: User = member.user;
		await this._client.mod.managers.mute.set(member, duration);
		this.logger.log('Actions', `Updated mute: '${user.tag}' in '${guild.name}. Duration: ${duration}ms'`);
	}

	// Unmute a user in a guild
	public async unmute(mutedUser: GuildMember, issuer: GuildMember, guild: Guild): Promise<GuildMember>
	{
		const storage: GuildStorage = this._client.storage.guilds.get(guild.id);
		const logChannel: TextChannel = <TextChannel> guild.channels.get(Constants.logChannelId);
		const embed: RichEmbed = new RichEmbed()
			.setColor(Constants.muteEmbedColor)
			.setAuthor(issuer.user.tag, issuer.user.avatarURL)
			.setDescription(`**Member:** ${mutedUser.user.tag} (${mutedUser.user.id})\n`
				+ `**Action:** Unmute`)
			.setTimestamp();
		logChannel.send({ embed: embed });

		return await mutedUser.removeRole(guild.roles.get(await storage.settings.get('mutedrole')));
	}

	/**
	 * Kick a user from a guild
	 */
	public async kick(member: GuildMember, guild: Guild, reason: string): Promise<GuildMember>
	{
		return await member.kick(reason);
	}

	/**
	 * Ban a user from a guild
	 */
	public async ban(user: User, guild: Guild, reason: string): Promise<GuildMember>
	{
		return <GuildMember> await guild.ban(user, { reason: reason, days: 7 });
	}

	/**
	 * Unban a user from a guild. Requires knowledge of the user's ID
	 */
	public async unban(id: string, guild: Guild): Promise<User>
	{
		return await guild.unban(id);
	}

	/**
	 * Softban a user from a guild, removing the past 7 days of their messages
	 */
	public async softban(user: User, guild: Guild, reason: string): Promise<User>
	{
		await guild.ban(user, { reason: `Softban: ${reason}`, days: 7 });
		await new Promise((r: any) => setTimeout(r, 5e3));
		return await guild.unban(user.id);
	}
}
