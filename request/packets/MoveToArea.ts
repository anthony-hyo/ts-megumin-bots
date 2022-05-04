import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";
import IMoveToArea, {IUserBranch} from "../../interface/request/IMoveToArea";
import Room from "../../data/Room";
import Main from "../../Main";
import logger from "../../utility/Logger";

export default class MoveToArea implements IRequest {

	public command: string = 'moveToArea'

	handler(bot: Bot, data: IMoveToArea): void {
		logger.info(`[moveToArea] [${bot.user.username}] joined ${data.areaName}`)

		bot.room = new Room(bot, data)

		bot.handler.onJoin()

		bot.room.freeWalk()

		data.uoBranch
			.forEach((uoBranch: IUserBranch): void => {
				if (!Main.singleton.bots.has(uoBranch.entID)) {
					Room.addPosition(data.strMapName, uoBranch.strFrame, uoBranch.strPad, uoBranch.tx, uoBranch.ty, 10)
				}
			})
	}

}