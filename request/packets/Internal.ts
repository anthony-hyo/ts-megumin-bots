import IRequest from "../../interface/IRequest";
import Bot from "../../bot/Bot";
import logger from "../../utility/Logger";
import Main from "../../Main";
import Room from "../../data/Room";
import Move from "../../interface/request/IUOTLS";

export default class Internal implements IRequest {

	public command: string = 'internal'

	handler(bot: Bot, data: any): void {
		const command = data.args[0]

		const args: Array<any> = data.args

		switch (command) {
			case 'loginResponse':
				const status: Boolean = args[2]

				if (status) {
					bot.network.id = args[3]

					Main.singleton.bots.set(bot.network.id, bot)

					bot.network.send('firstJoin')

					setTimeout(() => bot.network.send('retrieveInventory', [bot.network.id]), 3000)
				} else {
					logger.error(`login failed to ${bot.user.username}`)
				}
				break
			case 'server':
				if (String(args[2]).startsWith('You joined')) {
					bot.network.send('retrieveUserDatas', [bot.network.id])
				}
				break
			case 'chatm':
				const split: string[] = String(args[2]).split('~')

				if (bot.room.isBot(args[3])) {
					return
				}

				switch (split[0]) {
					case 'world':
						Main.singleton.seeborg.onMessage(bot, 'world', args[3], split[1])
						break;
					case 'trade':
						Main.singleton.seeborg.onMessage(bot, 'trade', args[3], split[1])
						break;
					case 'crosschat':
						Main.singleton.seeborg.onMessage(bot, 'crosschat', args[3], split[1])
						break;
					default:
						Main.singleton.seeborg.onMessage(bot, 'zone', args[3], split[1])
						break;
				}
				break
			case 'uotls':
				if (String(args[3]).includes('strFrame')) {
					const position: Move = Internal.parseMove(String(args[3]).split(','))

					if (!bot.room.isBot(args[2])) {
						Room.addPosition(bot.room.data.strMapName, position.strFrame, position.strPad, position.tx, position.ty, position.sp)
					}
				}
				break
			case 'resTimed':
				bot.handler.onSpawn()
				break;
		}
	}

	private static parseMove(value: string[]): Move {
		const split: string[] = String(value).split(':')

		const arr: Move = {
			tx: '0',
			ty: '0',
			sp: '10',
			strFrame: 'Enter',
			strPad: 'Left'
		}

		for (const splitItem of split) {
			switch (splitItem[0]) {
				case 'tx':
				case 'ty':
				case 'sp':
				case 'strFrame':
				case 'strPad':
					arr[splitItem[0]] = splitItem[1]
					break
			}
		}

		return arr
	}


}