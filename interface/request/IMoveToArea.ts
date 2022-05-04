interface IBranch {
	intHP: number
	intHPMax: number
	intMP: number
	intMPMax: number
	intState: number
}

interface ITime {
	date: number
	day: number
	hours: number
	minutes: number
	month: number
	nanos: number
	seconds: number
	time: number
	timezoneOffset: number
	year: number
}

export interface IUserBranch extends IBranch {
	Away: boolean
	entID: number
	entType: string
	intLevel: number
	showCloak: boolean
	showHelm: boolean
	strFrame: string
	strPad: string
	strUsername: string
	tx: number
	ty: number
	uoName: string
	isAdopted: boolean
}

export interface IMonBranch extends IBranch {
	MonID: string
	MonMapID: string
	bRed: boolean
	iLvl: number
	wDPS: number
}

export interface INpcBranch extends IBranch {
	NpcID: string
	NpcMapID: string
	isAdopted: boolean
	iLvl: number
	wDPS: number
}

export interface IMonDef extends IDef {
	MonID: string
	sRace: string
	isWorldBoss: boolean
	strBehave: string
	strElement: string
	strLinkage: string
	strMonFileName: string
	strMonName: string
}

export interface IMonMap {
	MonID: string
	MonMapID: string
	bRed: boolean
	intRSS: string
	strFrame: string
}

export interface INpcDef extends IDef {
	MonID: string
}

export interface INpcMap {
	NpcID: number
	strUsername: string
	strGender: string
	strHairFilename: string
	strHairName: string
	intLevel: number
	strClassName: string
	intColorEye: number
	intColorHair: number
	intColorSkin: number
	intColorTrim: number
	intColorBase: number
	intColorAccessory: number
	intColorName: number
	strChatColor: number
	isAdopted: boolean
	eqp: IEquipment
	X: number
	Y: number
	face: string
	frame: string
	animation: string
	state: string
	startTime: ITime
	endTime: ITime
	isStaffOnly: boolean
	actions: IAction[]
	dialogues: string[]
	NpcMapID: string
	bRed: boolean
	intRSS: string
	strFrame: string
}

export interface IDef {
	intHP: number
	intHPMax: number
	intLevel: number
	intMP: number
	intMPMax: number
}

export interface IAvatarEquipment {
	ItemID: number
	sFile: string
	sLink: string
}

export interface IEquipment {
	co: IAvatarEquipment
	ba: IAvatarEquipment
	he: IAvatarEquipment
	Weapon: IAvatarEquipment
	ar: IAvatarEquipment
}

export interface IAction {
	Name: string
	NameColor: string
	Subtitle: string
	SubtitleColor: string
	Action: string
	Value: string
	Icon: string
	IsStaffOnly: boolean
}

export default interface IMoveToArea {
	cmd: string
	areaId: number
	areaName: string
	areaCap: number
	isCycle: boolean
	sExtra: string
	strMusic: string
	strMapFileName: string
	strMapName: string
	uoBranch: IUserBranch[]
	monBranch: IMonBranch[]
	npcBranch: INpcBranch[]
	intType: number
	mondef: IMonDef[]
	monmap: IMonMap[]
	npcdef: INpcDef[]
	npcmap: INpcMap[]
}