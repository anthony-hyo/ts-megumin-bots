import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import {ILoadRetrieve, Item} from "../../../interface/request/ILoadRetrieve";
import logger from "../../../utility/Logger";
import Helper from "../../../utility/Helper";

export default class LoadRetrieve implements IRequest {

    public command: string = 'loadRetrieve'

    handler(bot: Bot, data: ILoadRetrieve): void {
        data.items.forEach((item: Item) => {
            if (item.Player !== 'On Listing') {
                logger.info(`[${bot.user.username}] [market] ${item.Player} "${Helper.parseHTML(item.sName)}"`)
                bot.network.send('retrieveAuctionItem', [ item.AuctionID ])
            }
        })
    }

}