import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";

export default class InitUserDatas implements IRequest {

    public command: string = 'initUserDatas'

    handler(bot: Bot, data: any): void {
    }

}