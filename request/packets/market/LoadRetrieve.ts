import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import {IMarket, Item} from "../../../interface/request/IMarket";
import logger from "../../../utility/Logger";
import Helper from "../../../utility/Helper";

export default class LoadRetrieve implements IRequest {

    public command: string = 'loadRetrieve'

    handler(bot: Bot, data: IMarket): void {
        data.items.forEach((item: Item) => {
            if (item.Player !== 'On Listing') {
                logger.info(`[${bot.user.username}] [market] ${item.Player} "${Helper.parseHTML(item.sName)}"`)
                bot.network.send('retrieveAuctionItem', [ item.AuctionID ])
            }
        })
    }

}