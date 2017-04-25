'use strict';

import Constants from '../util/constants';
import Handle from './Handle';

export default class Profile {
	// properties
	public handles: Array<Handle> = new Array();

	// methods
	public static getActiveHandle(profile: Profile): Handle {
		return profile.handles.find(a => a.active === true);
	}

	public static getEmbedColor(platform: string): number {
		switch (platform.toLowerCase()) {
			case 'pc':
				return 0xEF3333;
			case 'psn':
				return 0x003791;
			case 'xbl':
				return 0x107C10;
		}
	}
}
