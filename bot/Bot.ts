import Network from "../network/Network";
import axios, {AxiosResponse} from "axios";
import logger from "../utility/Logger";
import User from "../database/model/User";
import {ILoginResponseServer} from "../interface/ILoginResponseServer";
import {ILoginResponse} from "../interface/ILoginResponse";
import {IHandler} from "../interface/IHandler";
import Room from "../data/Room";
import BotProperties from "./BotProperties";
import Default from "./handler/Default";

export default class Bot {

	private readonly _user!: User

	private _room: Room = new Room(this, -1, 'none-1', 'none')

	private readonly _properties: BotProperties = new BotProperties()

	constructor(user: User) {
		logger.debug(`[Bot] found "${user.username}"`)

		this._user = user

		axios
			.post('https://redhero.online/api/game/login', {
				username: this._user.username,
				password: this._user.password
			})
			.then((response: AxiosResponse) => {
				const loginResponse: ILoginResponse = response.data;

				logger.warn(`[login] ${loginResponse.user.Name}`)

				this.properties.token = loginResponse.user.Hash

				const loginResponseServer: ILoginResponseServer | undefined = loginResponse.servers.find(server => server.Name == `Midgard`);

				if (loginResponseServer) {
					this._network = new Network(this, loginResponseServer.Port, loginResponseServer.IP)
				} else {
					logger.error(`[Bot] server undefined "${user.username}"`)
				}
			})
			.catch((response: any) => {
				logger.error(`[Bot] "${response.statusMessage}"`)
				Bot.create(this.user)
			})
	}

	private _network!: Network

	public get network(): Network {
		return this._network
	}

	public get user(): User {
		return this._user;
	}

	public get room(): Room {
		return this._room;
	}

	public set room(value: Room) {
		this._room = value;
	}

	public get properties(): BotProperties {
		return this._properties;
	}

	private _handler: IHandler = new Default(this)

	public get handler(): IHandler {
		return this._handler;
	}

	public set handler(value: IHandler) {
		this._handler = value;
	}

	public static create(user: User): Bot {
		return new Bot(user)
	}

}