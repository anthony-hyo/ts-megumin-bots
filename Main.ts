import Config from "./utility/Config"
import Database from "./database/Database"
import Request from "./request/Request";
import User from "./database/model/User";
import Bot from "./bot/Bot";
import {Sequelize} from "sequelize";
import Seeborg from "./seeborg/Seeborg";

const yaml = require('yaml-js')
const fs = require('fs')

export default class Main {

	public readonly bots: Map<Number, Bot> = new Map<Number, Bot>()
	public i = 0
	private readonly _config: Config = new Config(yaml.load(fs.readFileSync('./config.yml')))
	private readonly _seeborg: Seeborg = new Seeborg(this.config)
	private readonly database: Database = new Database(this.config)

	constructor() {
		Main._singleton = this

		this.bots.clear()

		User.findAll({
			// where: {
			//     username: {[Op.in]: ['Acid Bunny', 'Agapi Mou', 'Alliebear', 'Ancestor', 'Angel Baby', 'Andre the Giant', 'Amore Mio', 'Ankle Biter', 'Armrest', 'Ashkim', 'Baba Ganoush', 'Baby Angel', 'Beer Belly', 'Babett']}
			// },
			limit: 5,
			order: Sequelize.literal('random()')
		}).then((users: User[]) => users.forEach(user => this.startBot(user.id)))
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

	public startBot(botId: number): Bot {
		const bot = new Bot(botId)
		this.bots.set(botId, bot)
		return bot
	}

}

new Main();