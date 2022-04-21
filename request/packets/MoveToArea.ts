import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";
import Position from "../../database/model/Position";
import IMoveToArea, {UoBranch} from "../../interface/request/IMoveToArea";
import Room from "../../data/Room";
import Main from "../../Main";

export default class MoveToArea implements IRequest {

	public command: string = 'moveToArea'

	handler(bot: Bot, data: IMoveToArea): void {
		bot.room = new Room(bot, data.areaId, data.areaName, data.strMapName)

		bot.handler.onJoin(data)

		setTimeout(() => bot.room.freeWalk(), 3000)

		data.uoBranch
			.forEach((uoBranch: UoBranch): void => {
				if (!Main.singleton.bots.has(uoBranch.entID)) {
					// noinspection JSIgnoredPromiseFromCall
					/**
					 * Save players positions to be used by the bots
					 */
					Position.findCreateFind({
						where: {
							map_name: data.strMapName,
							frame: uoBranch.strFrame,
							pad: uoBranch.strPad,
							x: uoBranch.tx,
							y: uoBranch.ty
						}
					})
				}
			})
	}

}