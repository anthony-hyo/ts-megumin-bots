import IRequest from "../../../interface/IRequest";
import Bot from "../../../bot/Bot";
import Avatar from "../../../data/Avatar";
import Main from "../../../Main";

export default class EnterRoom implements IRequest {

	public command: string = 'joinRoom'

	handler(bot: Bot, data: any): void {
		Array(data.users).forEach(user => bot.room.players.set(data.networkId, new Avatar(user.networkId, user.username, Main.singleton.bots.has(user.networkId))))
	}

}