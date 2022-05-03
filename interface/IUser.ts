export interface IGuildPending {
}

export interface IGuildMembers {
	ID: number
	userName: string
	Level: number
	Rank: number
	Server: string
}

export interface IGuild {
	id: number
	Name: string
	Description: string
	MOTD: string
	pending: IGuildPending
	MaxMembers: number
	dateUpdated: string
	Color: number
	HallSize: number
	Kill: number
	Death: number
	Wins: number
	Loss: number
	RaidCount: number
	RaidWins: number
	RaidLoss: number
	Status: number
	Level: number
	intExp: number
	intExpToLevel: number
	Coins: number
	ul: IGuildMembers[]
	logs: any[]
	ranks: any[]
	invites: any[]
	alliances: any[]
	pendingAlliances: any[]
	guildHall: any[]
}

export interface IUserDaily {
	Day: number
	Date: number
}

export interface IUserGuildRank {
	id: number
	Name: string
	StartGuildWar: boolean
	ManageFinances: boolean
	InvitePlayers: boolean
	AcceptPlayers: boolean
	RemovePlayers: boolean
	PromotePlayers: boolean
	StartRaid: boolean
}

export interface IUser {
	iUpgDays: number
	intAccessLevel: number
	intColorAccessory: number
	intColorBase: number
	intColorEye: number
	intColorHair: number
	intColorSkin: number
	intColorTrim: number
	intColorName: number
	strChatColor: number
	intLevel: number
	strGender: string
	strHairFilename: string
	strHairName: string
	strUsername: string
	sServer: string
	intRebirth: number
	guild: IGuild
	iCP: number
	strClassName: string
	eqp: any[]
	CharID: number
	HairID: number
	UserID: number
	bPermaMute: number
	bitSuccess: string
	dCreated: string
	dUpgExp: string
	iAge: number
	iBagSlots: number
	iBankSlots: number
	iBoostCP: number
	iBoostG: number
	iBoostRep: number
	iBoostXP: number
	iBoostC: number
	iDBCP: number
	iDEX: number
	iDailyAdCap: number
	iDailyAds: number
	iEND: number
	iFounder: number
	iHouseSlots: number
	iINT: number
	iLCK: number
	iSTR: number
	iUpg: number
	iWIS: number
	intActivationFlag: number
	intCoins: number
	intDBExp: number
	intDBGold: number
	intExp: number
	intExpToLevel: number
	intGold: number
	intHP: number
	intHPMax: number
	intHits: number
	intMP: number
	intMPMax: number
	lastArea: string
	sCountry: string
	sHouseInfo: string
	strEmail: string
	strMapName: string
	strQuests: string
	strQuests2: string
	daily: IUserDaily
	guildRank: IUserGuildRank
	ia0: number
	ia1: number
	id0: number
	id1: number
	id2: number
	id3: number
	im0: number
	ip0: number
	ip1: number
	ip2: number
	iq0: number
}
