import Main from "./Main";
import Config from "./utility/Config";
import SeeborgGame from "./seeborg/SeeborgGame";
import Request from "./bot/network/request/Request";
import Database from "./database/Database";
import {exec} from "child_process";
import Megumin from "./megumin/Megumin";
import SeeborgDiscord from "./seeborg/SeeborgDiscord";

const yaml = require('yaml-js')
const fs = require('fs')

export default class MainMulti {

	private static _singletons: Map<string, Main> = new Map<string, Main>()

	private readonly _request: Request = new Request();
	private readonly _config: Config = new Config(yaml.load(fs.readFileSync('./config.yml')))
	private readonly _megumin: Megumin = new Megumin(this.config);
	private readonly _seeborgGame: SeeborgGame = new SeeborgGame(this.config, this.config.seeborg.game, 'dictionary_game.json')
	private readonly _seeborgDiscord: SeeborgDiscord = new SeeborgDiscord(this.config, this.config.seeborg.discord, 'dictionary_discord.json')
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

	public get megumin(): Megumin {
		return this._megumin;
	}

	public get seeborgGame(): SeeborgGame {
		return this._seeborgGame
	}

	public get seeborgDiscord(): SeeborgDiscord {
		return this._seeborgDiscord
	}

	public get database(): Database {
		return this._database;
	}

	public static singletons: (server: string) => Main = (server: string) => this._singletons.get(server)!;

	public init = (): void => MainMulti._singletons.forEach((main: Main) => main.init());

}

setTimeout(() => {
	exec('START start.bat')
	process.exit(1);
}, 3600000 * 2)

new MainMulti()