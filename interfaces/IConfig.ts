export interface IDatabase {
	user: string;
	password: string;
	dbname: string;
	host: string
	port: number
}

export interface IBehavior {
	speaking: boolean;
	learning: boolean;
	replyRate: number;
	replyMention: number;
	replyMagic: number;
	blacklistedPatterns: string[];
	ignoredUsers: string[];
	magicPatterns: string[];
}

export interface IChannelOverride {
	channel: string;
	behavior: IBehavior;
}

export interface ISeeborg {
	behavior: IBehavior;
	channelOverrides: IChannelOverride[];
}

export interface ISeeborgType {
	autoSavePeriod: number;
	game: ISeeborg
	discord: ISeeborg
}

export interface IConfig {
	token: string
	shard: number,
	database: IDatabase;
	administrator: string[]
	seeborg: ISeeborgType;
}