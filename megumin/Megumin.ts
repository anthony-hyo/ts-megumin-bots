import Config from "../utility/Config";
import {Client, Intents} from "discord.js";
import {ICooldown} from "../interfaces/discord/ICooldown";
import logger from "../utility/Logger";
import * as path from "path";
import Helper from "../utility/Helper";
import ICommand from "../interfaces/discord/ICommand";

export default class Megumin {

	private readonly _client: Client = new Client({
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MEMBERS,
			Intents.FLAGS.GUILD_INVITES,
			Intents.FLAGS.GUILD_MESSAGES,
		]
	})

	public static readonly commands: Map<String, ICommand> = new Map<String, ICommand>()

	public readonly cooldowns: Array<ICooldown> = new Array<ICooldown>()

	constructor(config: Config) {
		this._client.login(config.token)
			.then(async () => {
				await this.registerCommand()
				await this.registerListener()
			})
			.catch(error => logger.error(`Bot login error ${error}`))
	}

	public get client(): Client {
		return this._client;
	}

	public cooldown = (userId: string, name: string): ICooldown | undefined => this.cooldowns.find((value) => value.userId === userId && value.command === name);

	private async registerCommand(): Promise<void> {
		const location: string = path.resolve(__dirname, 'commands')

		const files: string[] = Helper.getAllFilesFromFolder(location)

		files.forEach(file => {
			const request: ICommand = new (require(file).default)()

			logger.info(`[Megumin] [registerCommand] ${request.name}`)

			Megumin.commands.set(request.name, request)
		});
	}

	private async registerListener(): Promise<void> {
		let location: string = path.resolve(__dirname, 'events')

		let files: string[] = Helper.getAllFilesFromFolder(location)

		for (let fileKey in files) {
			let file = files[fileKey]

			const event = require(file)

			logger.info(`[Megumin] [registerListener] ${event.name}`)

			if (event.once) {
				this._client.once(event.name, (...args) => event.execute(this, ...args))
			} else {
				this._client.on(event.name, (...args) => event.execute(this, ...args))
			}
		}
	}

	public getCommand(name: string): ICommand | undefined {
		const command: ICommand | undefined = Megumin.commands.get(name)

		if (command == undefined) {
			return undefined
		}

		return command
	}

}
