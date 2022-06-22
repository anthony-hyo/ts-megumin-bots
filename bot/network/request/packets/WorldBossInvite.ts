import Bot from "../../../Bot";
import IRequest from "../../../../interfaces/game/IRequest";

export default class MoveToArea implements IRequest {

	public command: string = 'WorldBossInvite'

	handler(bot: Bot, data: any): void {
		bot.handler.onWorldBoss(data)
	}

}