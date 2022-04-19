import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";
import Position from "../../database/model/Position";
import IMoveToArea, {UoBranch} from "../../interface/request/IMoveToArea";

export default class MoveToArea implements IRequest {

    public command: string = 'moveToArea'

    handler(bot: Bot, data: IMoveToArea): void {
        bot.join(data.areaId, data.areaName)

        bot.handler.onJoin(data)

        data.uoBranch.forEach((uoBranch: UoBranch) => {
            // noinspection JSIgnoredPromiseFromCall
            /**
             * Save players positions to be used by the bots
             */
            Position.findCreateFind({
                where: {
                    map_name: data.strMapName,
                    frame: uoBranch.strFrame,
                    pad: uoBranch.strPad,
                    x: uoBranch.tx,
                    y: uoBranch.ty
                }
            })
        })
    }

}