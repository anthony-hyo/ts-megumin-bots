export interface IItem {

	ItemID: number
	iQty: number
	bCoins: boolean
	bHouse: boolean
	bPTR: boolean
	bStaff: boolean
	bTemp: boolean
	bUpg: boolean
	bSpecial: boolean
	bTrade: boolean
	bSellable: boolean
	iCost: number
	iDPS: number
	iLvl: number
	iQSindex: number
	iQSvalue: number
	iRng: number
	iRty: number
	iStk: number
	sDesc: string
	sES: string
	sElmt: string
	sFile: string
	sIcon: string
	sLink: string
	sMeta: string
	sName: string
	sReqQuests: string
	sType: string

	iEnhLvl: number
	PatternID: number
	EnhID: number
	iEnh: number
	EnhLvl: number
	EnhPatternID: number
	EnhRty: number
	EnhRng: number
	InvEnhPatternID: number
	EnhDPS: number

	bBank: boolean
	CharItemID: number
	Qty: number
	iQtyRemain: number
	iHrs: number
	bEquip: boolean

	iClass: number
	iReqCP: number
	iReqGuildLevel: number
	iReqRep: number
	FactionID: number

	sClass: string
	sFaction: string
	sQuest: string
	ShopItemID: number

	dPurchase: string

	turnin: IItem[]

	//---------

	//--------- Auction

	AuctionID: number
	VendingID: number

	Duration: string
	Player: string
	Gold: number
	Coins: number

	auctionGold: number
	auctionCoins: number
	Quantity: number

	bSold: boolean

	//--------- Trade

	TradeID: number

	//--------- Quest
	iType: number
	iRate: number

}