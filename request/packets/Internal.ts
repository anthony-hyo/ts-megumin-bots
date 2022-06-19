import IRequest from "../../interface/IRequest";
import Bot from "../../bot/Bot";
import logger from "../../utility/Logger";
import Room from "../../data/Room";
import IUOTLS from "../../interface/request/IUOTLS";
import MainMulti from "../../MainMulti";

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

					MainMulti.singletons(bot.user.server).bots.set(bot.network.id, bot)

					bot.network.send('firstJoin')

					setTimeout(() => bot.network.send('retrieveInventory', [bot.network.id]), 1500)
				} else {
					logger.error(`login failed to ${bot.user.username}`)
				}
				break
			case 'server':
				if (!bot.properties.isLoad) {
					bot.properties.isLoad = true
					bot.network.send('retrieveUserDatas', [bot.network.id])
				}
				break
			case 'chatm':
				const split: string[] = String(args[2]).split('~')

				if (bot.room.isBot(args[3])) {
					return
				}

				bot.handler.onUserMessage(split[0], args[3], split[1])
				break
			case 'uotls':
				if (String(args[3]).includes('tx') && String(args[3]).includes('ty') && String(args[3]).includes('sp') && String(args[3]).includes('strFrame')) {
					const position: IUOTLS = Internal.parseUOTLS(String(args[3]).split(','))

					if (!bot.room.isBot(args[2])) {
						Room.addPosition(bot.room.data.strMapName, position.strFrame, position.strPad, position.tx, position.ty, position.sp, bot.user.server)
					}
				} else if (String(args[3]).includes('strPad') && String(args[3]).includes('tx') && String(args[3]).includes('strFrame') && String(args[3]).includes('ty')) {
					const position: IUOTLS = Internal.parseUOTLS(String(args[3]).split(','))

					bot.handler.onUserMoveToCell(args[2], position.strFrame)
				}
				break
			case 'resTimed':
				bot.handler.onSpawn()
				break
		}
	}

	private static parseUOTLS(values: string[]): IUOTLS {
		const uotls: IUOTLS = {
			tx: '0',
			ty: '0',
			sp: '10',
			strFrame: 'Enter',
			strPad: 'Left'
		}

		for (const value of values) {
			const split: string[] = value.split(':')

			switch (split[0]) {
				case 'tx':
				case 'ty':
				case 'sp':
				case 'strFrame':
				case 'strPad':
					if (uotls.hasOwnProperty(split[0] as keyof IUOTLS)) {
						uotls[split[0] as keyof IUOTLS] = split[1]
					}
					break
			}
		}

		return uotls
	}

}