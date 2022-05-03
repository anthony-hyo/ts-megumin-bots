import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";
import Helper from "../../utility/Helper";
import {IItem} from "../../interface/IItem";

export default class LoadInventoryBig implements IRequest {

	public command: string = 'loadInventoryBig'

	handler(bot: Bot, data: ILoadInventoryBig): void {
		bot.handler.onInventoryLoad(data)

		const arr: Array<IItem> = Helper.shuffle(data.items)

		const toEquip = {
			co: -1,
			Weapon: -1,
			ba: -1,
			ar: -1,
			pe: -1
		};

		for (const item of arr) {
			switch (item.sES) {
				case 'co':
				case 'Weapon':
				case 'ba':
				case 'ar':
				case 'pe':
					toEquip[item.sES] = item.ItemID
					break
			}
		}

		if (toEquip.co != -1) {
			bot.network.send('equipItem', [ toEquip.co ])
		}

		if (toEquip.Weapon != -1) {
			bot.network.send('equipItem', [ toEquip.Weapon ])
		}

		if (toEquip.ba != -1) {
			bot.network.send('equipItem', [ toEquip.ba ])
		}

		if (toEquip.ar != -1) {
			bot.network.send('equipItem', [ toEquip.ar ])
		}

		if (toEquip.pe != -1) {
			bot.network.send('equipItem', [ toEquip.pe ])
		}

	}

}