import Config from "./utility/Config"
import Database from "./database/Database"
import Request from "./request/Request";
import User from "./database/model/User";
import Bot from "./bot/Bot";
import {Op, Sequelize} from "sequelize";
import Seeborg from "./seeborg/Seeborg";
import axios, {AxiosResponse} from "axios";
import logger from "./utility/Logger";
import {IGameWorld, IMap} from "./interface/web/IGameWorld";

const yaml = require('yaml-js')
const fs = require('fs')

export default class Main {

	public readonly bots: Map<Number, Bot> = new Map<Number, Bot>()

	public readonly maps: Array<IMap> = []

	private readonly _request: Request = new Request();

	private readonly _config: Config = new Config(yaml.load(fs.readFileSync('./config.yml')))

	private readonly _seeborg: Seeborg = new Seeborg(this.config)

	private readonly database: Database = new Database(this.config)

	constructor() {
		Main._singleton = this

		axios
			.get(`https://redhero.online/api/game/world`)
			.then((response: AxiosResponse) => {
				const worlds: IGameWorld[] = response.data;

				worlds.forEach((world: IGameWorld) =>this.maps.push(world.map))

				let i: number = 0

				User
					.findAll({
						//limit: 5,
						order: Sequelize.literal('rand()')
					})
					.then((users: User[]) => users.forEach(user => {
						setTimeout(() => Bot.create(user), 1500 * i)
						i++
					}))
			})
			.catch((response: any) => {
				logger.error(`[main] game world response error "${response}"`)
			})
	}

	private static _singleton: Main

	public static get singleton(): Main {
		return this._singleton;
	}

	public get request(): Request {
		return this._request;
	}

	public get config(): Config {
		return this._config
	}

	public get seeborg(): Seeborg {
		return this._seeborg
	}

}

new Main();