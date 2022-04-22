export interface Database {
	user: string;
	password: string;
	dbname: string;
}

export interface Behavior {
	speaking: boolean;
	learning: boolean;
	replyRate: number;
	replyMention: number;
	replyMagic: number;
	blacklistedPatterns: string[];
	ignoredUsers: string[];
	magicPatterns: string[];
}

export interface ChannelOverride {
	channel: string;
	behavior: Behavior;
}

export interface Seeborg {
	autoSavePeriod: number;
	behavior: Behavior;
	channelOverrides: ChannelOverride[];
}

export interface IConfig {
	database: Database;
	seeborg: Seeborg;
}