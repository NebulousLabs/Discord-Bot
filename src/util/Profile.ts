'use strict';

import Constants from '../util/constants';
import Handle from './Handle';

export default class Profile {
	// properties
	public handles: Array<Handle> = new Array();

	// methods
	public static getActiveHandle(profile: Profile): Handle {
		if (profile) {
			return profile.handles.find(a => a.active === true);
		}
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

	public static getplatformEmoji(platform: string): string {
		switch (platform.toLowerCase()) {
			case 'pc':
				return '<:pc:308996881508466688>';

			case 'psn':
				return '<:ps:308996881328111616>';

			case 'xbl':
				return '<:xb:308996882204721152>';
		}
	}
}
