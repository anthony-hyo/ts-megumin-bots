import * as path from "path";
import logger from "../../../utility/Logger";
import Helper from "../../../utility/Helper";
import Bot from "../../Bot";
import IRequest from "../../../interfaces/game/IRequest";

export default class Request {

	private static readonly packets: Map<String, String> = new Map<String, String>()

	/*private static readonly ignored: Array<string> = [
		'equipItem', 'uotls', 'updateClass', 'stu', 'cvu','joinRoom', 'enterRoom', 'userGone','enhp',
		'aura+', 'aura-', 'clearAuras', 'updateGuild', 'sendLinkedItems', 'umsg', 'queueUpdate', 'addGoldExp',
		'addItems','sAct','getQuests','retrieveQuests', 'updateFriend', 'aura+p', 'ga', 'PVPS', 'sellItem'
	]*/

	constructor() {
		const location: string = path.resolve(__dirname, 'packets')

		const files: string[] = Helper.getAllFilesFromFolder(location)

		files.forEach(file => {
			const request: IRequest = new (require(file).default)()

			logger.debug(`[Request] ${request.command}`)

			Request.packets.set(request.command, file)
		});
	}

	public run(json: string, bot: Bot) {
		const data: any = JSON.parse(json)

		try {
			logger.silly(`[Request] (${bot.user.server}) [${bot.user.username}] received ${data.cmd}`)

			const command: String | undefined = Request.packets.get(data.cmd)

			if (command == undefined) {
				/*if (!Request.ignored.includes(data.cmd)) {
					logger.debug(`[Request] (${bot.user.server}) [${bot.user.username}] undefined request ${data.cmd}`)
				}*/
				return
			}

			const request: IRequest = new (require(command.toString()).default)()

			if (request) {
				request.handler(bot, data)
			} else {
				logger.error(`[Request] (${bot.user.server}) [${bot.user.username}] not found ${data.cmd}`)
			}
		} catch (error) {
			logger.error(`[Request] (${bot.user.server}) [${bot.user.username}] error ${data.cmd} ${error}`)
		}
	}

}