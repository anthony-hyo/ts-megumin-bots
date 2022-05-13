import Main from "./Main";
import Config from "./utility/Config";
import Seeborg from "./seeborg/Seeborg";
import Request from "./request/Request";
import Database from "./database/Database";

const yaml = require('yaml-js')
const fs = require('fs')

export default class MainMulti {

	private static _singletons: Map<string, Main> = new Map<string, Main>()

	private readonly _request: Request = new Request();
	private readonly _config: Config = new Config(yaml.load(fs.readFileSync('./config.yml')))
	private readonly _seeborg: Seeborg = new Seeborg(this.config)
	private readonly _database: Database = new Database(this)

	constructor() {
		MainMulti._singletons.set('RedHero', new Main('RedHero', 'Midgard', 'redhero.online'))
		MainMulti._singletons.set('RedAQ', new Main('RedAQ', 'Gondor', 'redaq.net'))

		MainMulti._singleton = this
	}

	private static _singleton: MainMulti;

	public static get singleton(): MainMulti {
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

	public get database(): Database {
		return this._database;
	}

	public static singletons: (server: string) => Main = (server: string) => this._singletons.get(server)!;

	public init = (): void => MainMulti._singletons.forEach((main: Main) => main.init());
}

new MainMulti()