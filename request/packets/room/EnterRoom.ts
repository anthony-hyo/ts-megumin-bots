import IRequest from "../../../interface/IRequest";
import Bot from "../../../bot/Bot";

export default class EnterRoom implements IRequest {

	public command: string = 'enterRoom'

	handler(bot: Bot, data: any): void {
		bot.room.addPlayer(data.networkId, data.username)
	}

}