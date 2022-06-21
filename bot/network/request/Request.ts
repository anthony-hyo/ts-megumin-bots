import * as path from "path";
import logger from "../../../utility/Logger";
import Helper from "../../../utility/Helper";
import Bot from "../../Bot";
import IRequest from "../../../interface/IRequest";

export default class Request {

	private static readonly packets: Map<String, String> = new Map<String, String>()

	/*private static readonly ignored: Array<string> = [
		'equipItem', 'uotls', 'updateClass', 'stu', 'cvu','joinRoom', 'enterRoom', 'userGone','enhp',
		'aura+', 'aura-', 'clearAuras', 'updateGuild', 'sendLinkedItems', 'umsg', 'queueUpdate', 'addGoldExp',
		'addItems','sAct','getQuests','retrieveQuests', 'updateFriend', 'aura+p', 'ga', 'PVPS', 'sellItem'
	]*/

	constructor() {
		let location: string = path.resolve(__dirname, 'packets')

		let files: string[] = Helper.getAllFilesFromFolder(location)

		files.forEach(file => {
			const request: IRequest = new (require(file).default)()

			logger.debug(`[request] ${request.command}`)

			Request.packets.set(request.command, file)
		});
	}

	public run(json: string, bot: Bot) {
		const data: any = JSON.parse(json)

		try {
			logger.debug(`[request] [${bot.user.username}] received ${data.cmd}`)

			const command: String | undefined = Request.packets.get(data.cmd)

			if (command == undefined) {
				/*if (!Request.ignored.includes(data.cmd)) {
					logger.debug(`[request] [${bot.user.username}] undefined request ${data.cmd}`)
				}*/
				return
			}

			const request: IRequest = new (require(command.toString()).default)()

			if (request) {
				request.handler(bot, data)
			} else {
				logger.error(`[request] [${bot.user.username}] not found ${data.cmd}`)
			}
		} catch (error) {
			logger.error(`[request] [${bot.user.username}] error ${data.cmd} ${error}`)
		}
	}

}