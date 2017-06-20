import NotesCommands from './commands/Notes';

export default class Commands {
	public readonly notes: NotesCommands;

	public constructor(connection: any) {
		this.notes = new NotesCommands(connection);
	}
}
