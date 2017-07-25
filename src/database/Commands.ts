import NotesCommands from './commands/Notes';
import MuteCommands from './commands/Mute';

export default class Commands {
	public readonly notes: NotesCommands;
	public readonly mute: MuteCommands;

	public constructor(connection: any) {
		this.notes = new NotesCommands(connection);
		this.mute = new MuteCommands(connection);
	}
}
