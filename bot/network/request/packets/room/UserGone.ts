import Bot from "../../../../Bot";
import IRequest from "../../../../../interface/IRequest";

export default class UserGone implements IRequest {

	public command: string = 'userGone'

	handler(bot: Bot, data: any): void {
		bot.room.removePlayer(data.networkId)
	}

}