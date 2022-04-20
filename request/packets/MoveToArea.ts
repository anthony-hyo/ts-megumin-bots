import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";
import Position from "../../database/model/Position";
import IMoveToArea, {UoBranch} from "../../interface/request/IMoveToArea";
import Avatar from "../../data/Avatar";

export default class MoveToArea implements IRequest {

    public command: string = 'moveToArea'

    handler(bot: Bot, data: IMoveToArea): void {
        bot.room.id = data.areaId
        bot.room.name = data.areaName.includes('-') ? data.areaName.split('-')[0] : data.areaName

        bot.handler.onJoin(data)

        setTimeout(() => {
            bot.room.freeWalk()
        }, 3000)

        data.uoBranch
            .forEach((uoBranch: UoBranch) => {
                const avatar: Avatar = new Avatar()
                avatar.username = uoBranch.strUsername

                bot.room.players.add(avatar)

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