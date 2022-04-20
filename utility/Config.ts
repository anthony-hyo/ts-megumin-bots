import IConfig, {ISeeborgConfig} from "../interface/IConfig";
import {IConfigDatabase} from "../interface/IConfigDatabase";

export default class Config {

	private readonly config: IConfig

	constructor(config: IConfig) {
		this.config = config
	}

	public get database(): IConfigDatabase {
		return this.config.database
	}

	/**
	 * Seeborg
	 */
	public get seeborg(): ISeeborgConfig {
		return this.config.seeborg
	}

	public autoSavePeriod() {
		return this.seeborg.autoSavePeriod;
	}

	public isIgnored(channel: string, username: string) {
		return this.behavior(channel, 'ignoredUsers').includes(username);
	}

	public matchesBlacklistedPattern(channel: string, line: string) {
		let patterns: any = this.behavior(channel, 'blacklistedPatterns');

		for (let pattern of patterns) {
			let regex = new RegExp(pattern, 'mi');
			if (regex.test(line)) {
				//logger.debug(`[Config] [Seeborg] blacklisted pattern(${pattern}) matched(${line}).`);
				return true;
			}
		}
		return false;
	}

	public matchesMagicPattern(channel: string, line: string) {
		let patterns: any = this.behavior(channel, 'magicPatterns');

		for (let pattern of patterns) {
			let regex = new RegExp(pattern, 'mi');
			if (regex.test(line)) {
				//logger.debug(`[Config] [Seeborg] magic pattern(${pattern}) matched(${line}).`);
				return true;
			}
		}
		return false;
	}

	public replyRate(channel: string) {
		return this.behavior(channel, 'replyRate');
	}

	public replyMention(channel: string) {
		return this.behavior(channel, 'replyMention');
	}

	public replyMagic(channel: string) {
		return this.behavior(channel, 'replyMagic');
	}

	public speaking(channel: string) {
		return this.behavior(channel, 'speaking');
	}

	public learning(channel: string) {
		return this.behavior(channel, 'learning');
	}

	/**
	 * Returns the property for the given channel if it's overridden;
	 * otherwise, it returns the
	 * property from the default, root behavior.
	 *
	 * @param {String} channel
	 * @param {String} propertyName
	 */
	public behavior(channel: string, propertyName: string): any {
		let defaultValue = this.seeborg.behavior[propertyName];
		let override = this._overrideForChannel(channel);

		if (override === null || !override.behavior.hasOwnProperty(propertyName)) {
			return defaultValue;
		} else {
			//logger.debug(`[Config] [Seeborg] Overriden behavior${propertyName} in ${channel}.`);
			return override.behavior[propertyName];
		}
	}

	/**
	 * Returns the override object for the channel with the given id.
	 *
	 * @param {String} channel
	 * @returns {?Object}
	 */
	public _overrideForChannel(channel: string) {
		const channelOverrides: any = this.seeborg.channelOverrides

		for (let override of channelOverrides) {
			if (override.channel === channel) {
				return override;
			}
		}

		return null;
	}

}
