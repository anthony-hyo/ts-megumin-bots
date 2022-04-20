import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import logger from "../../../utility/Logger";
import {IMarket} from "../../../interface/request/IMarket";
import Helper from "../../../utility/Helper";

export default class RetrieveAuctionItem implements IRequest {

    public command: string = 'retrieveAuctionItem'

    handler(bot: Bot, data: IMarket): void {
        logger.info(`[${bot.user.username}] [market] retrieved "${Helper.parseHTML(data.item.sName)}"`)
    }

}