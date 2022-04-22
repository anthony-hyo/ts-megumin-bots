import {Database, IConfig, Seeborg} from "../interface/IConfig";

export default class Config {

	private readonly config: IConfig

	constructor(config: IConfig) {
		this.config = config
	}

	public get database(): Database {
		return this.config.database
	}

	/**
	 * Seeborg
	 */
	public get seeborg(): Seeborg {
		return this.config.seeborg
	}

	public autoSavePeriod = () => this.seeborg.autoSavePeriod;

	public isIgnored = (channel: string, username: string) => this.behavior(channel, 'ignoredUsers').includes(username);

	private static match(patterns: any, line: string): boolean {
		for (let pattern of patterns) {
			let regex = new RegExp(pattern, 'mi');
			if (regex.test(line)) {
				return true
			}
		}

		return false;
	}

	public matchesBlacklistedPattern = (channel: string, line: string) => Config.match(this.behavior(channel, 'blacklistedPatterns'), line);

	public matchesMagicPattern = (channel: string, line: string) => Config.match(this.behavior(channel, 'magicPatterns'), line);

	public replyRate = (channel: string) => this.behavior(channel, 'replyRate');

	public replyMention = (channel: string) => this.behavior(channel, 'replyMention');

	public replyMagic = (channel: string) => this.behavior(channel, 'replyMagic');

	public speaking = (channel: string) => this.behavior(channel, 'speaking');

	public learning = (channel: string) => this.behavior(channel, 'learning');

	/**
	 * Returns the property for the given channel if it's overridden;
	 * otherwise, it returns the
	 * property from the default, root behavior.
	 *
	 * @param {String} channel
	 * @param {String} propertyName
	 */
	private behavior(channel: string, propertyName: string): any {
		// @ts-ignore
		let defaultValue: any = this.seeborg.behavior[propertyName];
		let override = this._overrideForChannel(channel)

		if (override === null || !override.behavior.hasOwnProperty(propertyName)) {
			return defaultValue
		} else {
			return override.behavior[propertyName]
		}
	}

	/**
	 * Returns the override object for the channel with the given id.
	 *
	 * @param {String} channel
	 * @returns {?Object}
	 */
	private _overrideForChannel(channel: string): any | null {
		const channelOverrides: any = this.seeborg.channelOverrides

		for (let override of channelOverrides) {
			if (override.channel === channel) {
				return override
			}
		}

		return null
	}

}
