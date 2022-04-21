import * as net from "net";
import logger from "../utility/Logger";
import Bot from "../bot/Bot";
import {INetworkSend} from "../interface/INetworkSend";
import Main from "../Main";
import WorldBoss from "../bot/handler/WorldBoss";

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
		logger.debug(`[send] "${this.bot.user.username}" "${command}" "${args.toString()}"`)

		this.write({
			type: 'request',
			body: {
				cmd: command,
				args: args
			}
		});
	}

	public event(command: string, args: Array<any>): void {
		logger.debug(`[event] "${this.bot.user.username}" "${command}" "${args.toString()}"`)

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
		this.socket.on('connect', () => {
			logger.debug('connected to server')

			this.event('login', [
				this.bot.user.username,
				this.bot.properties.token
			])

			this.bot.handler = new WorldBoss(this.bot)
		})

		this.socket.on('data', (data: any) => {
			this.chunk += data.toString();

			let d_index = this.chunk.indexOf(this.delimiter);

			while (d_index > -1) {
				try {
					const string = this.chunk.substring(0, d_index);

					logger.debug(`[received] ${string}`)

					Main.singleton.request.run(string, this.bot)
				} catch (error) {
					logger.error(`error when receiving ${error}`)
				}

				this.chunk = this.chunk.substring(d_index + this.delimiter.length)

				d_index = this.chunk.indexOf(this.delimiter)
			}
		})

		this.socket.on('error', (err: Error) => logger.error(`[error] "${this.bot.user.username}" "${err.message}"`))

		this.socket.on('close', (hadError: boolean) => {

			/**
			 * Remove user from bots
			 */
			Main.singleton.bots.delete(this.id)

			Bot.create(this.bot.user)

			logger.error(`[close] "${this.bot.user.username}" ${hadError ? `"with error"` : ``}`);
		})

		this.socket.on('end', () => logger.error(`[end] "${this.bot.user.username}"`))
	}

}