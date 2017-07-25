import * as Sequelize from 'sequelize';
import Model from './Model';

export default class MuteModel extends Model {
	public constructor(connection: any) {
		super({
			serverid: {
				type: Sequelize.TEXT,
				field: 'ServerID',
				allowNull: false
			},
			modid: {
				type: Sequelize.TEXT,
				field: 'ModeratorID',
				allowNull: false
			},
			userid: {
				type: Sequelize.TEXT,
				field: 'UserID',
				allowNull: false
			},
			actiontype: {
				type: Sequelize.TEXT,
				field: 'ActionType',
				defaultValue: 'Mute',
				allowNull: false
			},
			actionlength: {
				type: Sequelize.TEXT,
				field: 'ActionLength',
				allowNull: false
			},
			note: {
				type: Sequelize.TEXT,
				field: 'Note',
				allowNull: false
			}
		}, 'ModActions', connection);
	}
}
