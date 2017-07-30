import NotesCommands from './commands/Notes';
import MuteCommands from './commands/Mute';
import WarnCommands from './commands/Warn';

export default class Commands {
	public readonly notes: NotesCommands;
	public readonly mute: MuteCommands;
	public readonly warn: WarnCommands;

	public constructor(connection: any) {
		this.notes = new NotesCommands(connection);
		this.mute = new MuteCommands(connection);
		this.warn = new WarnCommands(connection);
	}
}
