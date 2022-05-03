import {IItem} from "../IItem";

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
	items: IItem[];
	item: IItem;
}