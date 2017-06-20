import Command from './Command';
import NotesModel from '../models/Notes';

export default class NotesCommands extends Command {
	public constructor(connection: any) {
		super();
		this.model = new NotesModel(connection).get();
	}

	public create(userid: string, author: string, note: string): Promise<any> {
		return this.model.create(
			{ userid, author, note }
		);
	}

	public get(userid: string): Promise<any> {
		return this.model.findAll({
			where: { userid },
			raw: true
		});
	}

	public delete(id: string): Promise<any> {
		return this.model.destroy({
			where: { id }
		});
	}
}
