import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import logger from "../../../utility/Logger";
import {ILoadRetrieve} from "../../../interface/request/ILoadRetrieve";
import Helper from "../../../utility/Helper";

export default class RetrieveAuctionItem implements IRequest {

    public command: string = 'retrieveAuctionItem'

    handler(bot: Bot, data: ILoadRetrieve): void {
        logger.info(`[${bot.user.username}] [market] retrieved "${Helper.parseHTML(data.item.sName)}"`)
    }

}