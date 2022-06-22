import Bot from "../../../../Bot";
import IRequest from "../../../../../interfaces/game/IRequest";

export default class EnterRoom implements IRequest {

	public command: string = 'enterRoom'

	handler(bot: Bot, data: any): void {
		bot.room.addPlayer(data.networkId, data.username)
	}

}