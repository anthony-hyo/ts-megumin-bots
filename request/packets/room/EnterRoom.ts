import IRequest from "../../../interface/IRequest";
import Bot from "../../../bot/Bot";
import Avatar from "../../../data/Avatar";
import Main from "../../../Main";

export default class EnterRoom implements IRequest {

	public command: string = 'enterRoom'

	handler(bot: Bot, data: any): void {
		bot.room.players.set(data.networkId, new Avatar(data.networkId, data.username, Main.singleton.bots.has(data.networkId)))
	}

}