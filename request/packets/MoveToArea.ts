import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";
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
					Room.addPosition(data.strMapName, uoBranch.strFrame, uoBranch.strPad, uoBranch.tx, uoBranch.ty, 10)
				}
			})
	}

}