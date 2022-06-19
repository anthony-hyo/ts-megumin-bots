import User from "./database/model/User";
import Bot from "./bot/Bot";
import {QueryTypes, Sequelize} from "sequelize";
import axios, {AxiosResponse} from "axios";
import logger from "./utility/Logger";
import {IGameWorld, IMap} from "./interface/web/IGameWorld";
import MainMulti from "./MainMulti";

const yaml = require('yaml-js')
const fs = require('fs')

export default class Main {

	public readonly bots: Map<Number, Bot> = new Map<Number, Bot>()
	public readonly maps: Array<IMap> = []
	public readonly queue: Map<Number, User> = new Map<Number, User>()

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

	public init(): void {
		logger.info(`[main] init ${this.name} at ${this.server}`)

		const seqOption = {
			replacements: { 
				ignore: [ 'monster/Monster', 'monster/WorldBoss', 'PvP', 'Fill', 'SupportRedHero', 'SupportRedAQ' ], 
				server: this.name
			},
			type: QueryTypes.UPDATE
		}

		MainMulti.singleton.database.sequelize.query("UPDATE users SET handler = 'Default' WHERE server = :server", seqOption)

		if (this.name === 'RedHero') {
			MainMulti.singleton.database.sequelize.query(`UPDATE users SET handler = 'SupportRedHero' WHERE handler NOT IN (:ignore) AND server = :server ORDER BY RAND() LIMIT 1`, seqOption)
		} else {
			MainMulti.singleton.database.sequelize.query(`UPDATE users SET handler = 'SupportRedAQ' WHERE handler NOT IN (:ignore) AND server = :server ORDER BY RAND() LIMIT 1`, seqOption)
		}

		MainMulti.singleton.database.sequelize.query(`UPDATE users SET handler = 'monster/WorldBoss' WHERE handler NOT IN (:ignore) AND server = :server ORDER BY RAND() LIMIT 25`, seqOption)

		MainMulti.singleton.database.sequelize.query(`UPDATE users SET handler = 'PvP' WHERE handler NOT IN (:ignore) AND server = :server ORDER BY RAND() LIMIT 50`, seqOption)

		MainMulti.singleton.database.sequelize.query("UPDATE users SET handler = 'monster/Monster' WHERE handler NOT IN (:ignore) AND server = :server ORDER BY RAND() LIMIT 50", seqOption)

		MainMulti.singleton.database.sequelize.query("UPDATE users SET handler = 'Fill' WHERE handler NOT IN (:ignore) AND server = :server ORDER BY RAND()", seqOption)

		setInterval(() => {
			if (this.queue.size > 0 && this.bots.size < 210) {
				const user: User = this.queue.values().next().value

				Bot.create(user)

				this.queue.delete(user.id)
			}
		}, 500)

		axios
			.get(`https://${this.url}/api/game/world`)
			.then((response: AxiosResponse) => {
				const worlds: IGameWorld[] = response.data;

				worlds.forEach((world: IGameWorld) => this.maps.push(world.map))

				User
					.findAll({
						where: {
							server: this.name
						},
						order: Sequelize.literal('rand()')
					})
					.then((users: User[]) => users.forEach(user => this.queue.set(user.id, user)))
			})
			.catch((response: any) => {
				logger.error(`[main] game world response error "${response}"`)
			})
	}

}