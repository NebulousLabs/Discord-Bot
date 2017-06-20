export default class Observer {
	private subjects: any = {};

	public on(event: string, fn: Function, args?: any): void {
		if (typeof event !== 'string' || !event || typeof fn !== 'function') {
			return;
		}
		if (!(event in this.subjects)) {
			this.subjects[event] = [];
		}
		this.subjects[event].push({ event, fn, args });
	}

	public emit(event: string, args?: any): void {
		if (event in this.subjects) {
			for (var index in this.subjects[event]) {
				var subject = this.subjects[event][index];
				subject.fn.call(this, subject.args, args);
			}
		}
	}

	public off(event: string, fn?: Function): void {
		if (!(event in this.subjects)) {
			return;
		}
		if (typeof fn === 'function') {
			for (var index in this.subjects[event]) {
				var subject = this.subjects[event][index];
				if (subject.fn === fn) {
					this.subjects[event].splice(0, index);
				}
			}
		} else {
			delete this.subjects[event];
		}
	}
}
