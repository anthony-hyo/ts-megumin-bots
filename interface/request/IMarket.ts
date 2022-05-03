import {IItem} from "../IItem";

export interface ISellMarketItem {
	cmd: string
	bitSuccess: boolean
	strMessage: string | undefined
	CharItemID: number
	Quantity: number
}

export interface IMarket {
	cmd: string;
	bitSuccess: boolean;
	strMessage: string
	items: IItem[];
	item: IItem;
}