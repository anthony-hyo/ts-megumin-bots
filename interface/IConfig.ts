export interface ISeeborgConfig {
	behavior: any;
	channelOverrides: any;
	autoSavePeriod: number;
}

export default interface IConfig {
	database: {
		user: string
		password: string
		dbname: string
		host: string
		port: number
	}
	seeborg: ISeeborgConfig
}