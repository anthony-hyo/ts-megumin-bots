import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";

const AvatarType = {
    PLAYER:'p',
    MONSTER: 'm',
    NPC: 'n'
}

const AvatarState = {
    DEAD: 0,
    NEUTRAL: 1,
    COMBAT: 2
}

export default class CombatState implements IRequest {

    public command: string = 'ct'

    private bot: Bot

    handler(bot: Bot, data: any): void {
        this.bot = bot

        // Player
        if (data.p != undefined) {
            this.parse(AvatarType.PLAYER, data.p)
        }

        // Monster
        if (data.m != undefined) {
            this.parse(AvatarType.MONSTER, data.m)
        }

        // NPC
        if (data.n != undefined) {
            this.parse(AvatarType.NPC, data.n)
        }
    }

    private parse(avatarType: string, data: any) {
        for (const pKey in data) {
            const element: any = data[pKey]

            if (element.intState !== undefined) {
                switch (element.intState) {
                    case AvatarState.DEAD:
                        //this.bot.handler.onTargetDeath()
                        if (pKey.toLocaleLowerCase() == this.bot.user.username.toLocaleLowerCase())
                            console.log(avatarType, pKey, 'DEAD')
                        break;
                    case AvatarState.NEUTRAL:
                        //console.log(avatarType, pKey, 'NEUTRAL')
                        break;
                    case AvatarState.COMBAT:
                        //console.log(avatarType, pKey, 'COMBAT')
                        break;
                }
            }
        }
    }

}