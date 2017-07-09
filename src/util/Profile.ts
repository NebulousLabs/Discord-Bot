import Constants from './Constants';
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

			case 'ps':
			case 'psn':
				return 0x003791;

			case 'xb':
			case 'xbl':
				return 0x107C10;
		}
	}

	public static getplatformEmoji(platform: string): string {
		switch (platform.toLowerCase()) {
			case 'pc':
				return Constants.blizzEmjoi;

			case 'ps':
			case 'psn':
				return Constants.psEmoji;

			case 'xb':
			case 'xbl':
			case 'xbox':
				return Constants.xbEmoji;
		}
	}
}
