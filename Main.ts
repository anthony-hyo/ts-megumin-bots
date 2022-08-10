import GameUser from "./database/model/GameUser";
import Bot from "./bot/Bot";
import {Sequelize} from "sequelize";
import axios, {AxiosResponse} from "axios";
import logger from "./utility/Logger";
import {IGameWorld} from "./interfaces/web/IGameWorld";
import MainMulti from "./MainMulti";
import Helper from "./utility/Helper";
import {IGameData} from "./interfaces/game/IGameData";

export default class Main {

	public readonly data: IGameData = {
		bots: new Map<number, Bot>(),
		users_queue: new Map<number, GameUser>(),
		maps: [],
		market_items: new Map<number, number>(),
	}

	private readonly _name: string
	private readonly _server: string
	private readonly _url: string

	constructor(name: string, server: string, url: string) {
		this._name = name;
		this._server = server;
		this._url = url;
	}

	public isBotByUsername(username: string): boolean {
		return Array.from(this.data.bots.values()).find((bot: Bot) => bot.user.username.toLowerCase() === username.toLowerCase()) !== undefined
	}

	public get name(): string {
		return this._name;
	}

	public get server(): string {
		return this._server;
	}

	public get url(): string {
		return this._url;
	}

	private readonly available_handlers: string[] = [
		'market/Market',
		//'monster/Monster',
		//'monster/WorldBoss',
		//'PvP',
		//'Fill'
	]

	public async init(): Promise<void> {
		logger.info(`[Main] init ${this.name} at ${this.server}`)

		const uniques: GameUser[] = await GameUser.findAll({
			where: {
				server: this.name,
				isUnique: true
			},
		})

		/**
		 * Uniques
		 */
		logger.warn(`[Main] (${this.name}) creating uniques..`)

		uniques.forEach(user => Bot.create(user));

		logger.info(`[Main] (${this.name}) uniques created.`)

		/**
		 * Login
		 */
		setInterval(() => {
			console.log(`this.data.bots size`, this.data.bots.size)
			if (this.data.users_queue.size > 0 && this.data.bots.size < 99999) {
				const user: GameUser = this.data.users_queue.values().next().value

				Bot.create(user)

				this.data.users_queue.delete(user.id)
			}
		}, 750)

		logger.info(`[Main] (${this.name}) game login interval initialized.`)

		/**
		 * Maps
		 */
		logger.warn(`[Main] (${this.name}) loading maps..`)

		const maps: AxiosResponse = await axios.get(`https://${this.url}/api/game/world`)

		logger.info(`[Main] (${this.name}) game maps loaded.`)

		const worlds: IGameWorld[] = maps.data;

		worlds.forEach((world: IGameWorld) => this.data.maps.push(world.map))

		/**
		 * Items
		 */
		const items: number[] = [
			8236, //Boss Soul
			13397, //Boss Blood
			16222, //Limit Break +5
			14936, //Limit Break +1
			19031 //Daemon's dimension fragment
		]

		items.forEach(itemId =>
			axios
				.get(`https://${this.url}/api/wiki/item/${itemId}`)
				.then((response: AxiosResponse) => {
					const json: any = response.data
					if (json.markets != null && json.markets.length) {
						this.data.market_items.set(itemId, json.MarketAverage)
					}
				})
				.catch(console.error))

		/**
		 * Users
		 */
		logger.warn(`[Main] (${this.name}) creating users..`)

		await MainMulti.singleton.database.sequelize
			.query("UPDATE game_users SET handler = 'Fill' WHERE isUnique = 0")

		const users: GameUser[] = await GameUser
			.findAll({
				where: {
					server: this.name,
					isUnique: false
				},
				order: Sequelize.literal('rand()')
			})

		users.forEach(user => {
			user.handler = this.available_handlers[Helper.randomIntegerInRange(0, this.available_handlers.length - 1)]
			user.save()
			this.data.users_queue.set(user.id, user)
		});

		logger.info(`[Main] (${this.name}) users created.`)
	}

}