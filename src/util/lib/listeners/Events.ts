import { GuildStorage, ListenerUtil } from 'yamdbf';
import { TextChannel, RichEmbed, Message, Guild, GuildMember, VoiceChannel } from 'discord.js';
import { SweeperClient } from '../SweeperClient';

const { on, registerListeners } = ListenerUtil;

export class Events {
	private _client: SweeperClient;

	public constructor(client: SweeperClient)
	{
		this._client = client;
		registerListeners(this._client, this);
	}

	@on('voiceStateUpdate')
	private async _onVoiceStateUpdate(oldMember: GuildMember, newMember: GuildMember): Promise<void> {

	}
}
