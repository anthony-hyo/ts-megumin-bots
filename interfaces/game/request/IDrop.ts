import {IItem} from "../game/IItem";

export interface IGetDrop {
	cmd: string
	ItemID: number
	CharItemID: number
	iQty: number
	bBank: boolean
	bSuccess: boolean
	showDrop: boolean
}

export interface IDropItem {
	cmd: string
	items: IItem[]
}