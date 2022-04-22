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
	iQty: number;
}

export interface IGetDrop {
	cmd: string;
	bBank: number;
	ItemID: number;
	bSuccess: boolean;
	CharItemID: number;
	iQty: number;
	showDrop: boolean;
}

export interface IDropItem {
	cmd: string;
	items: any;
}