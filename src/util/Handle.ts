export default class Handle {
	// properties
	public tag: string;
	public platform: string;
	public active: boolean;

	// constructor
	public constructor(tag: string, platform: string, active: boolean) {
		this.tag = tag;
		this.platform = platform;
		this.active = active;
	}
}
