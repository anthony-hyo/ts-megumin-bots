import Bot from "../../../Bot";
import IRequest from "../../../../interfaces/game/IRequest";

export default class DropItem implements IRequest {

	public command: string = 'levelUp'

	handler(bot: Bot, data: any): void {
		//console.log(data)
	}

}