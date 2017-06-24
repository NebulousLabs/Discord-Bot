import * as Sequelize from 'sequelize';
import Commands from './Commands';
import Observer from '../util/Observer';

let instance: Database = undefined;

// Commands (this.commands)
// 	enumerates ./commands/*, which extend ./commands/Command
// 		instantiated from ./models/*, which extend ./models/Model

export default class Database extends Observer {
	public user: string;
	public password: string;
	public host: string;
	public port: number;
	public database: string;
	public logging: Function;
	private connection: any;

	public commands: Commands;

	public constructor(credentials: any, logging: boolean = false) {
		super();
		if (!instance) {
			instance = this;
		} else {
			return instance;
		}

		this.user = credentials.user;
		this.password = credentials.password;
		this.host = credentials.host;
		this.port = credentials.port;
		this.database = credentials.database;
		this.logging = logging ? console.log : function() {};

		this.connect()
			.then(() => {
				this.commands = new Commands(this.connection);
				this.emit('connected');
			})
			.catch((error) => {
				console.error(error);
			});

		return instance;
	}

	private connect(): Promise<any> {
		this.connection = new Sequelize(this.database, this.user, this.password, {
			host: this.host,
			port: this.port,
			dialect: 'postgres',
			logging: this.logging,
			pool: {
				max: 5,
				min: 0,
				idle: 10000
			}
		});

		return this.connection.authenticate();
	}
}
