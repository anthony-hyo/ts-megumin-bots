import IRequest from "../../../interface/IRequest";
import Bot from "../../../bot/Bot";
import Avatar from "../../../data/Avatar";

export default class EnterRoom implements IRequest {

	public command: string = 'enterRoom'

	handler(bot: Bot, data: any): void {
		const avatar: Avatar = new Avatar()

		avatar.username = data.username
		avatar.networkId = data.networkId

		bot.room.players.add(avatar)
	}

}