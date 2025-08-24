import Bot from "../../../../Bot";
import IRequest from "../../../../../interfaces/game/IRequest";
import {IJoinRoom} from "../../../../../interfaces/game/request/IJoinRoom";

export default class EnterRoom implements IRequest {

	public command: string = 'joinRoom'

	handler(bot: Bot, data: IJoinRoom): void {
		bot.properties.clearAllInterval()
	}

}