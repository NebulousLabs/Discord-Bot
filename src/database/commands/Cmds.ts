import Command from './Command';
import * as sequelize from 'sequelize';

import MuteModel from '../models/Mute';
import WarnModel from '../models/Warn';
import NotesModel from '../models/Notes';
import BanModel from '../models/Ban';

export class MuteCommands extends Command {
	public constructor(connection: any) {
		super();
		this.model = new MuteModel(connection).get();
	}

	public addMute(serverid: string, modid: string, userid: string, actionlength: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Mute', actionlength, note }
		);
	}
}

export class WarnCommands extends Command {
	public constructor(connection: any) {
		super();
		this.model = new WarnModel(connection).get();
	}

	public addWarn(serverid: string, modid: string, userid: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Warn', note }
		);
	}
}

export class NoteCommands extends Command {
	public constructor(connection: any) {
		super();
		this.model = new NotesModel(connection).get();
	}

	public createNote(serverid: string, modid: string, userid: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, note }
		);
	}

	public getNote(serverid: string, userid: string): Promise<any> {
		return this.model.findAll({
			order: [[sequelize.col('id'), 'DESC']],
			where: { serverid, userid, actiontype: 'Note' },
			limit: 5,
			raw: true
		});
	}

	public getOneNote(noteid: number, serverid: string, userid: string): Promise<any> {
		return this.model.findAll({
			where: { id: noteid, serverid, userid, actiontype: 'Note' }
		});
	}

	public deleteNote(id: number, serverid: string, userid: string): Promise<any> {
		return this.model.destroy({
			where: { id, serverid, userid }
		});
	}

	public resetNote(serverid: string, userid: string): Promise<any> {
		return this.model.destroy({
			where: { serverid, userid }
		});
	}
}

export class BanCommands extends Command {
	private connection: any;

	public constructor(connection: any) {
		super();
		this.connection = connection;
		this.model = new BanModel(connection).get();
	}

	// Creats a database entry for a ban addition
	public addBan(serverid: string, modid: string, userid: string, actionlength: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Ban', actionlength, note }
		);
	}

	// Creates a database entry for a ban removal
	public removeBan(serverid: string, modid: string, userid: string, note: string): Promise<any> {
		return this.model.create(
			{ serverid, modid, userid, actiontype: 'Unban', note }
		);
	}

	// History Section
	// Get latest history data
	public getHistory(serverid: string, userid: string, limit: number = 5): Promise<any> {
		return this.model.findAll({
			order: [[sequelize.col('id'), 'DESC']],
			where: { serverid, userid },
			limit: limit,
			raw: true
		});
	}

	// Get count of actions
	public getHistoryCount(serverid: string, userid: string): Promise<any> {
		return this.connection.query('SELECT \"ActionType\" as \"Type\", count(\"ActionType\") as \"Count\" FROM \"ModActions\" WHERE \"ServerID\" = :sid AND \"UserID\" = :uid GROUP BY \"Type\"',
			{ replacements: { sid: serverid, uid: userid }, type: sequelize.QueryTypes.SELECT });
	}
}
