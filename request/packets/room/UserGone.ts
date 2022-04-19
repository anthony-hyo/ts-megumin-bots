import IRequest from "../../../interface/IRequest";
import Bot from "../../../bot/Bot";

export default class EnterRoom implements IRequest {

	public command: string = 'userGone'

	handler(bot: Bot, data: any): void {
		for (const avatar of bot.room.players) {
			if (avatar.networkId === data.networkId) {
				bot.room.players.delete(avatar)
				break
			}
		}
	}

}