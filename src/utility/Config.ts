import {IBehavior, IChannelOverride, IConfig, IDatabase, ISeeborg, ISeeborgType} from "../interfaces/IConfig";

export default class Config {

	private readonly config: IConfig

	constructor(config: IConfig) {
		this.config = config
	}

	public get token(): string {
		return this.config.token
	}

	public get shard(): number {
		return this.config.shard
	}

	public get database(): IDatabase {
		return this.config.database
	}

	public get administrator(): string[] {
		return this.config.administrator
	}

	/**
	 * Seeborg
	 */
	public get seeborg(): ISeeborgType {
		return this.config.seeborg
	}

	private static match(patterns: any, line: string): boolean {
		for (let pattern of patterns) {
			let regex = new RegExp(pattern, 'mi');
			if (regex.test(line)) {
				return true
			}
		}

		return false;
	}

	/**
	 * Returns the property for the given channel if it's overridden;
	 * otherwise, it returns the
	 * property from the default, root behavior.
	 *
	 * @param where
	 * @param {String} channel
	 * @param {String} propertyName
	 */
	private static behavior(where: ISeeborg, channel: string, propertyName: string): any {
		const override = Config._overrideForChannel(where, channel)
		return override === null || !override.behavior.hasOwnProperty(propertyName) ? where.behavior[propertyName as keyof IBehavior] : override.behavior[propertyName];
	}

	/**
	 * Returns the override object for the channel with the given id.
	 *
	 * @param where
	 * @param {String} channel
	 * @returns {?Object}
	 */
	private static _overrideForChannel(where: ISeeborg, channel: string): any | null {
		const channelOverrides: IChannelOverride[] = where.channelOverrides

		for (const override of channelOverrides) {
			if (override.channel === channel) {
				return override
			}
		}

		return null
	}

	public autoSavePeriod: () => number = () => this.seeborg.autoSavePeriod;

	public isIgnored: (where: ISeeborg, channel: string, username: string) => boolean = (where: ISeeborg, channel: string, username: string) => Config.behavior(where, channel, 'ignoredUsers').includes(username);

	public matchesBlacklistedPattern: (where: ISeeborg, channel: string, line: string) => boolean = (where: ISeeborg, channel: string, line: string) => Config.match(Config.behavior(where, channel, 'blacklistedPatterns'), line);

	public matchesMagicPattern: (where: ISeeborg, channel: string, line: string) => boolean = (where: ISeeborg, channel: string, line: string) => Config.match(Config.behavior(where, channel, 'magicPatterns'), line);

	public replyRate: (where: ISeeborg, channel: string) => number = (where: ISeeborg, channel: string) => Config.behavior(where, channel, 'replyRate');

	public replyMention: (where: ISeeborg, channel: string) => number = (where: ISeeborg, channel: string) => Config.behavior(where, channel, 'replyMention');

	public replyMagic: (where: ISeeborg, channel: string) => number = (where: ISeeborg, channel: string) => Config.behavior(where, channel, 'replyMagic');

	public speaking: (where: ISeeborg, channel: string) => boolean = (where: ISeeborg, channel: string) => Config.behavior(where, channel, 'speaking');

	public learning: (where: ISeeborg, channel: string) => boolean = (where: ISeeborg, channel: string) => Config.behavior(where, channel, 'learning');

}
