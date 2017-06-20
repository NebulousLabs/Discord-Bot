export default class Model {
	public connection: any;
	public model: any;

	public constructor(schema: any, title: string, connection: any) {
		this.connection = connection;
		this.model = connection.define(title, schema, {
			freezeTableName: true
		});
		this.model.sync();
	}

	public get(): any {
		return this.model;
	}
}
