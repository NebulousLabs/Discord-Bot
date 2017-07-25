import Command from './Command';
import MuteModel from '../models/Mute';
import * as sequelize from 'sequelize';

export default class MuteCommands extends Command {
	public constructor(connection: any) {
		super();
		this.model = new MuteModel(connection).get();
	}

	public add(serverid: string, modid: string, userid: string, actionlength: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Mute', actionlength, note }
		);
	}
}
