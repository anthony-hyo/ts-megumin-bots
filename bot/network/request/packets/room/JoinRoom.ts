import Bot from "../../../../Bot";
import IRequest from "../../../../../interface/IRequest";
import {IJoinRoom} from "../../../../../interface/request/IJoinRoom";

export default class EnterRoom implements IRequest {

	public command: string = 'joinRoom'

	handler(bot: Bot, data: IJoinRoom): void {
		bot.properties.clearAllInterval()
	}

}