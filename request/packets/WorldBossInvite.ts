import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";

export default class MoveToArea implements IRequest {

    public command: string = 'WorldBossInvite'

    handler(bot: Bot, data: any): void {
        bot.properties.required_monsters.push(data.monName)

        bot.network.send('joinWorldBoss', [data.worldBossId])
    }

}