import Bot from "../Bot";
import {IRemoveItem} from "../../interfaces/game/request/IRemoveItem";
import {IItem} from "../../interfaces/game/IItem";

export default class Inventory {

	private readonly bot: Bot

	public inventory: Map<Number, IItem> = new Map<Number, IItem>()

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