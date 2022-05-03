import Bot from "../Bot";
import {IRemoveItem} from "../../interface/request/IRemoveItem";
import {IItem} from "../../interface/IItem";

export default class Inventory {

	public inventory: Map<Number, IItem> = new Map<Number, IItem>()
	private bot: Bot

	public constructor(bot: Bot) {
		this.bot = bot
	}

	public get all(): Map<Number, IItem> {
		return this.inventory
	}

	public add(add: IItem): void {
		this.inventory.set(add.ItemID, add)
	}

	public removeByCharItemID(remove: IRemoveItem): void {
		this.inventory.forEach((value: IItem, key: Number) => {
			if (value.CharItemID === remove.CharItemID) {
				this.inventory.delete(key)
			}
		})
	}

}