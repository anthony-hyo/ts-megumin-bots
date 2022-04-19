import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";
import {IMoveToArea} from "../../interface/request/MoveToArea";

export default class MoveToArea implements IRequest {

    public command: string = 'moveToArea'

    handler(bot: Bot, data: IMoveToArea): void {
        bot.join(data.areaId, data.areaName)

        bot.handler.onJoin(data)
    }

}