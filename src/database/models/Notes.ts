import * as Sequelize from 'sequelize';
import Model from './Model';

export default class NotesModel extends Model {
	public constructor(connection: any) {
		super({
			author: {
				type: Sequelize.STRING,
				field: 'author',
				allowNull: false
			},
			userid: {
				type: Sequelize.STRING,
				field: 'userid',
				allowNull: false
			},
			note: {
				type: Sequelize.STRING,
				field: 'note',
				allowNull: false
			}
		}, 'Notes', connection);
	}
}
