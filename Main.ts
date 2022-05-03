import Config from "./utility/Config"
import Database from "./database/Database"
import Request from "./request/Request";
import User from "./database/model/User";
import Bot from "./bot/Bot";
import {Op, Sequelize} from "sequelize";
import Seeborg from "./seeborg/Seeborg";
import Helper from "./utility/Helper";

const yaml = require('yaml-js')
const fs = require('fs')

export default class Main {

	public readonly bots: Map<Number, Bot> = new Map<Number, Bot>()

	private readonly _config: Config = new Config(yaml.load(fs.readFileSync('./config.yml')))

	private readonly _seeborg: Seeborg = new Seeborg(this.config)

	private readonly database: Database = new Database(this.config)

	constructor() {
		Main._singleton = this

		this.bots.clear()

		let i: number = 0

		User.findAll({
			 where: {
			 	username: 'Acid Bunny'
			},

			limit: 1,

			order: Sequelize.literal('rand()')
		}).then((users: User[]) => users.forEach(user => {
			setTimeout(() => Bot.create(user), 1000 * i)
			i++
		}))
	}

	private static _singleton: Main

	public static get singleton(): Main {
		return this._singleton;
	}

	private _request: Request = new Request();

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