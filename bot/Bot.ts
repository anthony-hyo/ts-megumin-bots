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
import {IItem} from "../interfaces/game/IItem";
import {IUser} from "../interfaces/game/IUser";
import {IMap} from "../interfaces/web/IGameWorld";
import IMoveToArea from "../interfaces/game/request/IMoveToArea";
import MainMulti from "../MainMulti";
import Network from "./network/Network";

export default class Bot {

	private readonly _user!: GameUser
	private readonly _properties: Properties = new Properties(this)
	private readonly _inventory: Inventory = new Inventory(this)

	constructor(user: GameUser) {
		logger.debug(`[Bot] found "${user.username}"`)

		this._user = user

		axios
			.post(`https://${MainMulti.singletons(this.user.server).url}/api/game/login`, {
				username: this._user.username,
				password: this._user.password
			})
			.then((response: AxiosResponse) => {
				const loginResponse: ILoginResponse = response.data;

				if (loginResponse.user === undefined) {
					logger.error(`[Bot] [login] (${this.user.server}) ${user.username} user undefined "${user.username}"`)
					this.handler.onDisconnect()
					return
				}

				logger.debug(`[Bot] [login] (${this.user.server}) ${user.username} as "${this.user.handler}"`)

				this.properties.token = loginResponse.user.Hash

				const loginResponseServer: ILoginResponseServer | undefined = loginResponse.servers.find(server => server.Name == MainMulti.singletons(this.user.server).server);

				if (loginResponseServer) {
					//this.bot.network = new Network(this, loginResponseServer.Port, '192.168.10.160')
					this.network = new Network(this, loginResponseServer.Port, loginResponseServer.IP)
				} else {
					logger.error(`[Bot] [login] (${this.user.server}) ${user.username} server undefined "${user.username}"`)
					this.handler.onDisconnect()
				}
			})
			.catch((response: any) => {
				logger.error(`[Bot] [login] (${this.user.server}) ${user.username} "${response}"`)
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

	// public get haste():Number {
	// 	return 1 - Math.min(Math.max(tha, -1), 0.85)
	// }

	public static create = (user: GameUser): Bot => new Bot(user);

	public joinMap(map: string) {
		logger.debug(`[request] [${this.user.username}] joining ${map}`)
		this.network.send('cmd', ['tfer', '', map])
	}

	public joinMapRandom() {
		setTimeout(() => {
			try {
				const maps: IMap[] = MainMulti.singletons(this.user.server).maps.filter(value => value.ReqLevel <= this.data.intLevel)
				this.joinMap(maps[Helper.randomIntegerInRange(0, maps.length - 1)].Name)
			} catch (e) {
				this.network.disconnect()
			}
		}, 3000)
	}

	public marketSell(item: IItem): void {
		let i: number = 0

		switch (item.ItemID) {
			case 8236: //Boss Soul
			case 13397: //Boss Blood
			case 16222: //Limit Break +5
			case 14936: //Limit Break +1
				axios
					.get(`https://${MainMulti.singletons(this.user.server).url}/api/wiki/item/${item.ItemID}`)
					.then((response: AxiosResponse) => {
						const json: any = response.data

						if (i > 4) {
							return
						}

						if (json.markets != null && json.markets.length > 0 && item.iQty > 50) {
							const costs: Array<number> = []

							json.markets.forEach((market: { Coins: any; }) => costs.push(Number(market.Coins)))

							const quantity: number = Math.min(item.iQty, 20)

							const cost: number = Helper.replaceLastDigit(json.MarketAverage * quantity)

							setTimeout(() => {
								logger.debug(`[market] [${this.user.username}] selling "${Helper.parseHTML(item.sName)}" for "${cost}" Coins`)

								this.network.send("sellAuctionItem", [
									item.ItemID,
									item.CharItemID,
									quantity,
									cost,
									0
								])
							}, Helper.randomIntegerInRange(1000, 60000))

							i++
						}
					})
					.catch(console.error)
				break;
		}
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

}