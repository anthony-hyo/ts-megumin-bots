import IRequest from "../../interface/IRequest";
import Bot from "../../bot/Bot";
import logger from "../../utility/Logger";
import Main from "../../Main";

export default class Internal implements IRequest {

    public command: string = 'internal'

    handler(bot: Bot, data: any): void {
        const command = data.args[0]

        const args: Array<any> = data.args

        logger.debug(`[internal] ${data.args.toString()}`)

        switch (command) {
            case 'loginResponse':
                const status:Boolean = args[2]

                if (status) {
                    bot.network.send('firstJoin')
                } else {
                    logger.error(`login failed to ${bot.user.username}`)
                }
                break
            case 'server':
                if (String(args[2]).startsWith('You joined')) {
                    bot.network.send('retrieveUserDatas', [ bot.network.id ])
                }
                break
            case 'chatm':
                const split: string[] = String(args[2]).split('~')

                if (String(args[3]).toLowerCase() !== bot.user.username.toLowerCase()) {
                    Main.singleton.seeborg.onMessage(bot, 'zone', args[3], split[1])
                }
                break
        }
    }

}