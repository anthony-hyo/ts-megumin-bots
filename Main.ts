import GameUser from "./database/model/GameUser";
import Bot from "./bot/Bot";
import {Op, QueryTypes, Sequelize} from "sequelize";
import axios, {AxiosResponse} from "axios";
import logger from "./utility/Logger";
import {IGameWorld, IMap} from "./interfaces/web/IGameWorld";
import MainMulti from "./MainMulti";

export default class Main {

	public readonly bots: Map<Number, Bot> = new Map<Number, Bot>()
	public readonly maps: Array<IMap> = []
	public readonly queue_users: Map<Number, GameUser> = new Map<Number, GameUser>()

	private readonly _name: string
	private readonly _server: string
	private readonly _url: string

	constructor(name: string, server: string, url: string) {
		this._name = name;
		this._server = server;
		this._url = url;
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

	public async init(): Promise<void> {
		logger.info(`[Main] init ${this.name} at ${this.server}`)

		const seqOption = {
			replacements: {
				ignore: [ 'monster/Monster', 'monster/WorldBoss', 'PvP', 'Fill', 'SupportRedHero', 'SupportRedAQ' ],
				server: this.name
			},
			type: QueryTypes.UPDATE
		}

		await MainMulti.singleton.database.sequelize
			.query("UPDATE game_users SET handler = 'Default' WHERE username != 'Support Gwapo' AND server = :server", seqOption)

		await MainMulti.singleton.database.sequelize
			.query(`UPDATE game_users SET handler = 'monster/WorldBoss' WHERE handler NOT IN (:ignore) AND server = :server ORDER BY RAND() LIMIT 25`, seqOption)

		await MainMulti.singleton.database.sequelize
			.query(`UPDATE game_users SET handler = 'PvP' WHERE handler NOT IN (:ignore) AND server = :server ORDER BY RAND() LIMIT 15`, seqOption)

		await MainMulti.singleton.database.sequelize
			.query("UPDATE game_users SET handler = 'monster/Monster' WHERE handler NOT IN (:ignore) AND server = :server ORDER BY RAND() LIMIT 50", seqOption)

		await MainMulti.singleton.database.sequelize
			.query("UPDATE game_users SET handler = 'Fill' WHERE handler NOT IN (:ignore) AND server = :server ORDER BY RAND()", seqOption)

		const supports: GameUser[] = await GameUser.findAll({
			where: {
				server: this.name,
				username: "Support Gwapo"
			},
		})

		logger.warn(`[Main] (${this.name}) creating supports..`)

		supports.forEach(user => Bot.create(user));

		logger.info(`[Main] (${this.name}) supports created.`)

		setInterval(() => {
			if (this.queue_users.size > 0 && this.bots.size < 210) {
				const user: GameUser = this.queue_users.values().next().value

				Bot.create(user)

				this.queue_users.delete(user.id)
			}
		}, 1200)

		logger.info(`[Main] (${this.name}) game login interval initialized.`)

		logger.warn(`[Main] (${this.name}) loading maps..`)

		const maps: AxiosResponse = await axios.get(`https://${this.url}/api/game/world`)

		logger.info(`[Main] (${this.name}) game maps loaded.`)

		const worlds: IGameWorld[] = maps.data;

		worlds.forEach((world: IGameWorld) => this.maps.push(world.map))

		logger.warn(`[Main] (${this.name}) creating users..`)

		const users: GameUser[] = await GameUser
			.findAll({
				where: {
					server: this.name,
					username: {
						[Op.ne]: "Support Gwapo"
					}
				},
				order: Sequelize.literal('rand()')
			})

		users.forEach(user => this.queue_users.set(user.id, user));

		logger.info(`[Main] (${this.name}) users created.`)
	}

}