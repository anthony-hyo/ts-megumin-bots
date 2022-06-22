import Bot from "../../../Bot";
import IRequest from "../../../../interfaces/game/IRequest";
import IMoveToArea, {IUserBranch} from "../../../../interfaces/game/request/IMoveToArea";
import Room from "../../../data/Room";
import MainMulti from "../../../../MainMulti";
import logger from "../../../../utility/Logger";

export default class MoveToArea implements IRequest {

	public command: string = 'moveToArea'

	handler(bot: Bot, data: IMoveToArea): void {
		logger.debug(`[moveToArea] [${bot.user.username}] joined ${data.areaName}`)

		bot.room = new Room(bot, data)

		data.uoBranch.forEach(user => bot.room.addPlayer(user.entID, user.strUsername))

		bot.handler.onJoin()

		bot.room.freeWalk()

		data.uoBranch
			.forEach((uoBranch: IUserBranch): void => {
				if (!MainMulti.singletons(bot.user.server).bots.has(uoBranch.entID)) {
					Room.addPosition(data.strMapName, uoBranch.strFrame, uoBranch.strPad, uoBranch.tx, uoBranch.ty, 10, bot.user.server)
				}
			})
	}

}