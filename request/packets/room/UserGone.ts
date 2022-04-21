import IRequest from "../../../interface/IRequest";
import Bot from "../../../bot/Bot";

export default class UserGone implements IRequest {

	public command: string = 'userGone'

	handler(bot: Bot, data: any): void {
		bot.room.players.delete(data.networkId)
	}

}