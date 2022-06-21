import Bot from "../../../../Bot";
import IRequest from "../../../../../interface/IRequest";

export default class PvPInvite implements IRequest {

	public command: string = 'PVPI'

	handler(bot: Bot, data: any): void {
		bot.network.send("PVPIr", [ 1 ])
	}

}