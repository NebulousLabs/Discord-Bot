import Command from './Command';
import NotesModel from '../models/Notes';

export default class NotesCommands extends Command {
	public constructor(connection: any) {
		super();
		this.model = new NotesModel(connection).get();
	}

	public create(serverid: string, modid: string, userid: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, note }
		);
	}

	public get(serverid: string, userid: string): Promise<any> {
		return this.model.findAll({
			where: { serverid, userid },
			raw: true
		});
	}

	public delete(id: number): Promise<any> {
		return this.model.destroy({
			where: { id }
		});
	}

	public reset(serverid: string, userid: string): Promise<any> {
		return this.model.destroy({
			where: { serverid, userid }
		});
	}
}
