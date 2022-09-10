import axios, {AxiosResponse} from "axios";
import logger from "../utility/Logger";
import GameUser from "../database/model/GameUser";
import {ILoginResponseServer} from "../interfaces/web/ILoginResponseServer";
import {ILoginResponse} from "../interfaces/web/ILoginResponse";
import {IHandler} from "../interfaces/game/IHandler";
import Room from "./data/Room";
import Properties from "./Properties";
import Default from "./handler/Default";
import Helper from "../utility/Helper";
import Inventory from "./data/Inventory";
import {IUser} from "../interfaces/game/IUser";
import {IMap} from "../interfaces/web/IGameWorld";
import IMoveToArea, {IMonMap} from "../interfaces/game/request/IMoveToArea";
import MainMulti from "../MainMulti";
import Network from "./network/Network";
import {AvatarState} from "./network/request/packets/CombatState";
import Main from "../Main";

export default class Bot {

	private readonly _user!: GameUser
	private readonly _properties: Properties = new Properties(this)
	private readonly _inventory: Inventory = new Inventory(this)

	public readonly singleton: Main

	constructor(user: GameUser) {
		logger.debug(`[Bot] found "${user.username}"`)

		this._user = user

		this.singleton = MainMulti.singletons(this._user.server)

		axios
			.post(`https://${this.singleton.url}/api/game/login`, {
				username: this._user.username,
				password: this._user.password
			})
			.then((response: AxiosResponse) => {
				const loginResponse: ILoginResponse = response.data;

				if (loginResponse.user === undefined) {
					logger.error(`[Bot] [login] (${this.user.server}) [${user.username}] user undefined "${user.username}"`)
					this.handler.onDisconnect()
					return
				}

				logger.info(`[Bot] [login] (${this.user.server}) [${user.username}] as "${this.user.handler}"`)

				this.properties.token = loginResponse.user.Hash

				const loginResponseServer: ILoginResponseServer | undefined = loginResponse.servers.find(server => server.Name == this.singleton.server);

				if (loginResponseServer) {
					this.network = new Network(this, loginResponseServer.Port, MainMulti.singleton.config.database.password === '123' ? loginResponseServer.IP : '192.168.10.160')
				} else {
					logger.error(`[Bot] [login] (${this.user.server}) [${user.username}] server undefined "${user.username}"`)
					this.handler.onDisconnect()
				}
			})
			.catch((response: any) => {
				logger.error(`[Bot] [login] (${this.user.server}) [${user.username}] 1 "${response}"`)
				this.handler.onDisconnect()
			})
	}

	private _data: IUser = <IUser>{};

	public get data(): IUser {
		return this._data;
	}

	public set data(value: IUser) {
		this._data = value;
	}

	private _room: Room = new Room(this, <IMoveToArea>{})

	public get room(): Room {
		return this._room;
	}

	public set room(value: Room) {
		this._room = value;
	}

	private _network: Network | undefined

	public get network(): Network {
		return <Network>this._network
	}

	private set network(value: Network) {
		this._network = value;
	}

	public get user(): GameUser {
		return this._user;
	}

	public get properties(): Properties {
		return this._properties;
	}

	public get inventory(): Inventory {
		return this._inventory;
	}

	private _handler: IHandler = new Default(this)

	public get handler(): IHandler {
		return this._handler;
	}

	public set handler(value: IHandler) {
		this._handler = value;
	}

	// public get haste():number {
	// 	return 1 - Math.min(Math.max(tha, -1), 0.85)
	// }

	public static create = (user: GameUser): Bot => new Bot(user);

	public joinMap(map: string, frame: string = 'Enter', pad: string = 'Spawn') {
		logger.debug(`[Bot] [joinMap] (${this.user.server}) [${this.user.username}] joining ${map}-${frame}-${pad}`)

		this.network.send('cmd', [
			'tfer',
			'', //username kkk
			map, //area name
			frame, //area frame
			pad, //area pad
		])
	}

	public joinMapRandom() {
		setTimeout(() => {
			try {
				const maps: IMap[] = this.singleton.data.maps.filter(value => value.ReqLevel <= this.data.intLevel)
				this.joinMap(maps[Helper.randomIntegerInRange(0, maps.length - 1)].Name)
			} catch (e) {
				this.network.disconnect()
			}
		}, 3000)
	}

	public sendMessage(channel:string, message: string): void {
		switch (channel) {
			case 'world':
			case 'trade':
			case 'crosschat':
				this.network.send('message', [message, channel])
				break;
			default:
				this.network.send('message', [message, 'zone'])
				break;
		}
	}

	public attackRandomTarget(): void {
		if (this.room.data.monmap !== undefined && this.room.data.monmap.length > 0) {
			for (const value of this.room.data.mondef) {
				if (value.isWorldBoss) {
					const mon = this.room.data.monBranch.filter(value2 => value2.MonID === value.MonID)[0]

					/**
					 * Join new map random if World Boss state dead
					 */
					if (mon.intState == AvatarState.DEAD) {
						this.joinMapRandom()
						return
					}

					this.properties.wasOnWorldBoss = true
				}
			}

			const monster: IMonMap = this.room.data.monmap[Helper.randomIntegerInRange(0, this.room.data.monmap.length - 1)]

			/**
			 * Move to cell and Attack
			 */
			setTimeout(() => {
				this.room.moveToCell(monster.strFrame, 'Left')

				this.properties.intervalAttack = setInterval(() => {
					if (this.room.frame === monster.strFrame) {
						this.network.send('gar', [1, `${['aa', 'a1', 'a2', 'a3', 'a4'][Helper.randomIntegerInRange(0, 4)]}>m:${monster.MonMapID}`, "wvz"])
					}
				}, 2000)
			}, 3000)
		}
	}

}