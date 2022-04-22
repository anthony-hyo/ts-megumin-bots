export interface Item {
	ItemID: number;
	bCoins: number;
	bHouse: number;
	bPTR: number;
	bStaff: number;
	bTemp: number;
	bUpg: number;
	bTrade: number;
	bSellable: number;
	bSpecial: boolean;
	iCost: number;
	iDPS: number;
	iLvl: number;
	iRng: number;
	iRty: number;
	iStk: number;
	iQSindex: number;
	iQSvalue: number;
	sQuest: string;
	sDesc: string;
	sES: string;
	sElmt: string;
	sFile: string;
	sIcon: string;
	sLink: string;
	sName: string;
	iReqCP: number;
	iClass: number;
	sClass: string;
	iReqRep: number;
	FactionID: number;
	sFaction: string;
	iReqGuildLevel: number;
	sReqQuests: string;
	sType: string;
	sMeta: string;
	bBank: number;
	CharItemID: number;
	iQty: number;
	bEquip: string;
	iHrs: number;
	dPurchase: string;
	EnhID: number;
	EnhLvl: number;
	EnhPatternID: number;
	EnhRty: number;
	EnhRng: number;
	InvEnhPatternID: number;
	EnhDPS: number;
	AuctionID: number;
	Player: string;
	Duration: string;
	Gold: number;
	Coins: number;
	bSold: boolean;
}

export interface ISellMarketItem {
	cmd: string
	bitSuccess: number
	strMessage: string | undefined
	CharItemID: number
	Quantity: number
}

export interface IMarket {
	cmd: string;
	bitSuccess: number;
	strMessage: string
	items: Item[];
	item: Item;
}