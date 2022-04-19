import Default from "./Default";
import axios, {AxiosResponse} from "axios";
import logger from "../../utility/Logger";
import Helper from "../../utility/Helper";
import Position from "../../database/model/Position";
import {Sequelize} from "sequelize";
import IMoveToArea, {Monmap} from "../../interface/request/IMoveToArea";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";

export default class WorldBoss extends Default {

    onJoin(data: IMoveToArea): void {

        /**
         * Find position to move
         */
        Position
            .findOne({
                where: {
                    map_name: data.strMapName
                },
                order: Sequelize.literal('random()')
            })
            .then((position: Position) => {
                this.bot.network.send('moveToCell', [
                    position.frame,
                    position.pad
                ])
                setTimeout(() => {
                    this.bot.network.send("mv", [
                        position.x,
                        position.y,
                        10 //ignored
                    ])
                }, 2000)
            })
            .catch(logger.error)

        if (data.monmap !== undefined && data.monmap.length > 0) {
            const monster: Monmap = data.monmap[0]

            setTimeout(() => {
                this.bot.network.send('moveToCell', [
                    monster.strFrame,
                    'Left'
                ])

                setInterval(() => {
                    this.bot.network.send('gar', [23,`aa>m:${monster.MonMapID}`,"wvz"])
                }, 3000)
            }, 3000)
        }
    }

    onInventoryLoad(data: ILoadInventoryBig) {
        data.items.forEach(item => {
            switch (item.ItemID) {
                case 8236:
                case 13397:
                case 16222:
                case 14936:
                    axios
                        .get(`https://redhero.online/api/wiki/item/${item.ItemID}`)
                        .then((response: AxiosResponse) => {
                            const json: any = response.data

                            if (json.markets != null && json.markets.length > 0) {
                                const costs: Array<number> = []

                                json.markets.forEach(market => costs.push(Number(market.Coins)))

                                const cost: number = Math.round(Helper.arrayAverage(costs)) * item.iQty

                                logger.info(`[market] selling "${item.sName}" for "${cost}" Coins`)

                                this.bot.network.send("sellAuctionItem", [
                                    item.ItemID,
                                    item.CharItemID,
                                    item.iQty,
                                    cost,
                                    0
                                ])
                            }
                        })
                        .catch(logger.error)
                    break;
            }
        })
    }

}