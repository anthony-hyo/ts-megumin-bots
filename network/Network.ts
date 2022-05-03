import * as net from "net";
import logger from "../utility/Logger";
import Bot from "../bot/Bot";
import {INetworkSend} from "../interface/INetworkSend";
import Main from "../Main";
import * as path from "path";
import Default from "../bot/handler/Default";

export default class Network {

	private readonly socket: net.Socket = new net.Socket()

	private readonly bot: Bot

	private readonly delimiter: string = '\0';

	private chunk: string = "";

	constructor(bot: Bot, port: number, ip: string) {
		this.bot = bot

		this.socket.connect(port, ip);

		this.socket.setEncoding('utf-8');

		this.listeners()
	}

	private _id = -1

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}

	public send(command: string, args: Array<any> = []): void {
		logger.debug(`[network] [${this.bot.user.username}] send command: ${command} with args: ${args.toString()}`)

		this.write({
			type: 'request',
			body: {
				cmd: command,
				args: args
			}
		});
	}

	public event(command: string, args: Array<any>): void {
		logger.debug(`[network] [${this.bot.user.username}] event command: ${command} with args: ${args.toString()}`)

		this.write({
			type: 'event',
			body: {
				cmd: command,
				args: args
			}
		});
	}

	public write(iNetworkSend: INetworkSend): void {
		this.socket.write(`${JSON.stringify(iNetworkSend)}\0`)
	}

	private listeners(): void {
		this.socket.on('connect', this.onConnect.bind(this))

		this.socket.on('data', this.onData.bind(this))

		this.socket.on('error', this.onError.bind(this))

		this.socket.on('close', this.onClose.bind(this))

		this.socket.on('end', this.onEnd.bind(this))
	}

	private onConnect(): void {
		logger.debug(`[network] [${this.bot.user.username}] connected to server`)

		this.event('login', [
			this.bot.user.username,
			this.bot.properties.token
		])

		try {
			this.bot.handler = new (require(path.resolve(__dirname, '..', 'bot', 'handler', `${this.bot.user.handler}.ts`)).default)(this.bot)
		} catch (ignored) {
			logger.error(`[network] [${this.bot.user.username}] could now find any handler ${path.resolve(__dirname, '..', 'bot', 'handler', `${this.bot.user.handler}.ts`)} using Default`)
			this.bot.handler = new Default(this.bot)
		}
	}

	private onData(data: any): void {
		this.chunk += data.toString();

		let d_index = this.chunk.indexOf(this.delimiter);

		while (d_index > -1) {
			try {
				const string = this.chunk.substring(0, d_index);

				logger.debug(`[network] [${this.bot.user.username}] received ${string}`)

				Main.singleton.request.run(string, this.bot)
			} catch (error) {
				logger.error(`[network] [${this.bot.user.username}] received error ${error}`)
			}

			this.chunk = this.chunk.substring(d_index + this.delimiter.length)

			d_index = this.chunk.indexOf(this.delimiter)
		}
	}

	private onError(err: Error): void {
		logger.error(`[network] [${this.bot.user.username}] error "${this.bot.user.username}" "${err.message}"`);
	}

	private onClose(hadError: boolean): void {
		if (this.bot.properties.intervalAttack != null) {
			clearInterval(this.bot.properties.intervalAttack)
		}

		if (this.bot.properties.intervalWalk != null) {
			clearInterval(this.bot.properties.intervalWalk)
		}

		Main.singleton.bots.delete(this.id)

		Bot.create(this.bot.user)

		logger.error(`[network] [${this.bot.user.username}] close ${hadError ? `"with error"` : ``}`)
	}

	private onEnd(): void {
		logger.error(`[network] [${this.bot.user.username}] end "${this.bot.user.username}"`);
	}

}