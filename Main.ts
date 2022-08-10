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

	private readonly _name: 'RedHero' | 'RedAQ'
	private readonly _server: string
	private readonly _url: string

	constructor(name: 'RedHero' | 'RedAQ', server: string, url: string) {
		this._name = name;
		this._server = server;
		this._url = url;
	}

	public isBotByUsername(username: string): boolean {
		return Array.from(this.data.bots.values()).find((bot: Bot) => bot.user.username.toLowerCase() === username.toLowerCase()) !== undefined
	}

	public get name(): 'RedHero' | 'RedAQ' {
		return this._name;
	}

	public get server(): string {
		return this._server;
	}

	public get url(): string {
		return this._url;
	}

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
		let items: number[]
		let available_handlers: string[]

		if (this.name === 'RedHero') {
			items = [
				8236, //Boss Soul
				13397, //Boss Blood
				16222, //Limit Break +5
				14936, //Limit Break +1
				19031, //Daemon's dimension fragment
				19599, //Boss Gem I
				19600, //Boss Gem II
				19601, //Boss Gem III
			];

			available_handlers = [
				'market/Market',
				'monster/Monster',
				'monster/WorldBoss',
				'PvP',
				'Fill'
			]
		} else {
			items = [
				1934, //Boss Soul
				2070, //Boss Blood
				16222, //Limit Break +5
				14936, //Limit Break +1
			];

			available_handlers = [
				'monster/Monster',
				'monster/WorldBoss',
				'PvP',
				'Fill'
			]
		}

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
			user.handler = available_handlers[Helper.randomIntegerInRange(0, available_handlers.length - 1)]
			user.save()
			this.data.users_queue.set(user.id, user)
		});

		logger.info(`[Main] (${this.name}) users created.`)
	}

}