import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";
import ILoadInventoryBig from "../../interface/request/Item";

export default class LoadInventoryBig implements IRequest {

    public command: string = 'loadInventoryBig'

    handler(bot: Bot, data: ILoadInventoryBig): void {
        bot.handler.onInventoryLoad(data)
    }

}