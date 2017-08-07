import { MuteCommands, WarnCommands, NoteCommands, BanCommands } from './commands/Cmds';

export default class Commands {
	public readonly note: NoteCommands;
	public readonly mute: MuteCommands;
	public readonly warn: WarnCommands;
	public readonly ban: BanCommands;

	public constructor(connection: any) {
		this.note = new NoteCommands(connection);
		this.mute = new MuteCommands(connection);
		this.warn = new WarnCommands(connection);
		this.ban = new BanCommands(connection);
	}
}
