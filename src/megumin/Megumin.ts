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

	private static readonly location_commands: string = path.resolve(__dirname, 'commands')
	private static readonly location_events: string = path.resolve(__dirname, 'events')

	public init(token: string) {
		this._client.login(token)
			.then(() => {
				this.registerCommand()
				this.registerListener()
			})
			.catch(error => logger.error(`Bot login error ${error}`))
	}

	public get client(): Client {
		return this._client;
	}

	public cooldown = (userId: string, name: string): ICooldown | undefined => this.cooldowns.find((value) => value.userId === userId && value.command === name);

	public getCommand(name: string): ICommand | undefined {
		const command: ICommand | undefined = Megumin.commands.get(name)

		if (command == undefined) {
			return undefined
		}

		return command
	}

	private registerCommand(): void {
		Helper.getAllFilesFromFolder(Megumin.location_commands).forEach(file => {
			const request: ICommand = new (require(file).default)()

			logger.warn(`[Megumin] [registerCommand] ${request.name}`)

			Megumin.commands.set(request.name, request)
		});
	}

	private registerListener(): void {
		Helper.getAllFilesFromFolder(Megumin.location_events).forEach(file => {
			const event = require(file)

			logger.warn(`[Megumin] [registerListener] ${event.name}`)

			if (event.once) {
				this._client.once(event.name, (...args) => event.execute(this, ...args))
			} else {
				this._client.on(event.name, (...args) => event.execute(this, ...args))
			}
		});
	}

}
