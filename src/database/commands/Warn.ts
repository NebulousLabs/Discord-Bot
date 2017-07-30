import Command from './Command';
import WarnModel from '../models/Warn';
import * as sequelize from 'sequelize';

export default class WarnCommands extends Command {
	public constructor(connection: any) {
		super();
		this.model = new WarnModel(connection).get();
	}

	public add(serverid: string, modid: string, userid: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Warn', note }
		);
	}
}
