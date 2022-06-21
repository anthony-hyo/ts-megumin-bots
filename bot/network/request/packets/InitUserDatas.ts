import Bot from "../../../Bot";
import IRequest from "../../../../interface/IRequest";
import {IInitUserData, IUsers} from "../../../../interface/request/IInitUserData";

export default class InitUserDatas implements IRequest {

	public command: string = 'initUserDatas'

	handler(bot: Bot, data: IInitUserData): void {
		data.a.forEach((user: IUsers) => {
			if (user.uid == bot.network.id) {
				bot.data = user.data
			}
		})
	}

}