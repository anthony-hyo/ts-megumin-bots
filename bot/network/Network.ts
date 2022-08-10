import * as net from "net";
import Bot from "../Bot";
import logger from "../../utility/Logger";
import {INetworkSend} from "../../interfaces/game/INetworkSend";
import * as path from "path";
import MainMulti from "../../MainMulti";
import Default from "../handler/Default";

import {encode} from 'js-base64';

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

	private _id: number = -1

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = Number(value);
	}

	public send(command: string, args: Array<any> = []): void {
		logger.debug(`[Network] (${this.bot.user.server}) [${this.bot.user.username}] send command: ${command} with args: ${args.toString()}`)

		this.write({
			type: 'request',
			body: {
				cmd: command,
				args: args
			}
		});
	}

	public event(command: string, args: Array<any>): void {
		logger.debug(`[Network] (${this.bot.user.server}) [${this.bot.user.username}] event command: ${command} with args: ${args.toString()}`)

		this.write({
			type: 'event',
			body: {
				cmd: command,
				args: args
			}
		});
	}

	public write(iNetworkSend: INetworkSend): void {
		this.socket.write(`${encode(JSON.stringify(iNetworkSend))}\0`)
	}

	public disconnect():void {
		this.socket.end()
	}

	private listeners(): void {
		this.socket.on('connect', this.onConnect.bind(this))

		this.socket.on('data', this.onData.bind(this))

		this.socket.on('error', this.onError.bind(this))

		this.socket.on('close', this.onClose.bind(this))

		this.socket.on('end', this.onEnd.bind(this))
	}

	private onConnect(): void {
		logger.debug(`[Network] (${this.bot.user.server}) [${this.bot.user.username}] connected to server`)

		this.event('login', [
			this.bot.user.username,
			this.bot.properties.token
		])

		try {
			this.bot.handler = new (require(path.resolve(__dirname, '..', 'handler', `${this.bot.user.handler}.ts`)).default)(this.bot)
		} catch (ignored) {
			logger.error(`[Network] (${this.bot.user.server}) [${this.bot.user.username}] could now find or error "${path.resolve(__dirname, '..', 'handler', `${this.bot.user.handler}.ts`)}" handler using "Default"`)
			this.bot.handler = new Default(this.bot)
		}

		this.bot.handler.onConnect()
	}

	private onData(data: any): void {
		this.chunk += data.toString();

		let d_index = this.chunk.indexOf(this.delimiter);

		while (d_index > -1) {
			try {
				const string = this.chunk.substring(0, d_index);

				logger.silly(`[Network] (${this.bot.user.server}) [${this.bot.user.username}] received ${string}`)

				MainMulti.singleton.request.run(string, this.bot)
			} catch (error) {
				logger.error(`[Network] (${this.bot.user.server}) [${this.bot.user.username}] received error ${error}`)
			}

			this.chunk = this.chunk.substring(d_index + this.delimiter.length)

			d_index = this.chunk.indexOf(this.delimiter)
		}
	}

	private onError(err: Error): void {
		logger.error(`[Network] (${this.bot.user.server}) [${this.bot.user.username}] error "${this.bot.user.username}" "${err.message}"`);

		this.bot.handler.onDisconnect()
	}

	private onClose(hadError: boolean): void {
		logger.error(`[Network] (${this.bot.user.server}) [${this.bot.user.username}] close ${hadError ? `"with error"` : ``}`)

		this.bot.handler.onDisconnect()
	}

	private onEnd(): void {
		logger.error(`[Network] (${this.bot.user.server}) [${this.bot.user.username}] end`);

		this.bot.handler.onDisconnect()
	}

}