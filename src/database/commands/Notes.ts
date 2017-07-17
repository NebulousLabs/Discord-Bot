import Command from './Command';
import NotesModel from '../models/Notes';
import * as sequelize from 'sequelize';

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
			order: [[sequelize.col('id'), 'DESC']],
			where: { serverid, userid, actiontype: 'Note' },
			limit: 5,
			raw: true
		});
	}

	public getOne(noteid: number, serverid: string, userid: string): Promise<any> {
		return this.model.findAll({
			where: { id: noteid, serverid, userid, actiontype: 'Note' }
		});
	}

	public delete(id: number, serverid: string, userid: string): Promise<any> {
		return this.model.destroy({
			where: { id, serverid, userid }
		});
	}

	public reset(serverid: string, userid: string): Promise<any> {
		return this.model.destroy({
			where: { serverid, userid }
		});
	}
}
