import IRequest from "../interface/IRequest";
import * as path from "path";
import Helper from "../utility/Helper";
import Bot from "../bot/Bot";
import logger from "../utility/Logger";

export default class Request {

	private readonly packets: Map<String, String> = new Map<String, String>()

	constructor() {
		let location: string = path.resolve(__dirname, 'packets')

		let files: string[] = Helper.getAllFilesFromFolder(location)

		files.forEach(file => {
			const request: IRequest = new (require(file).default)()

			logger.debug(`[request] ${request.command}`)

			this.packets.set(request.command, file)
		});
	}

	public run(json: string, bot: Bot) {
		const data: any = JSON.parse(json)

		try {
			logger.debug(`[received] ${data.cmd}`)

			const command: String | undefined = this.packets.get(data.cmd)

			if (command == undefined) {
				if (!['equipItem', 'uotls', 'updateClass', 'stu', 'cvu', 'joinRoom', 'enterRoom', 'userGone', 'enhp', 'aura+', 'aura-', 'clearAuras', 'updateGuild', 'sendLinkedItems', 'umsg'].includes(data.cmd)) {
					logger.warn(`[request] "${bot.user.username}" "${bot.room.fullName}" undefined "${data.cmd}"`)
				}
				return
			}

			const request: IRequest = new (require(command.toString()).default)()

			if (request) {
				request.handler(bot, data)
			} else {
				logger.error(`[request] "${bot.user.username}" "${bot.room.fullName}" not found "${data.cmd}"`)
			}
		} catch (error) {
			logger.error(`[request] "${bot.user.username}" "${bot.room.fullName}" error ${data.cmd} ${error}`)
		}
	}

}