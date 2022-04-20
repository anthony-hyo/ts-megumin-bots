import Network from "../network/Network";
import axios, {AxiosResponse} from "axios";
import logger from "../utility/Logger";
import User from "../database/model/User";
import {ILoginResponseServer} from "../interface/ILoginResponseServer";
import {ILoginResponse} from "../interface/ILoginResponse";
import {IHandler} from "../interface/IHandler";
import WorldBoss from "./handler/WorldBoss";
import Room from "../data/Room";
import BotProperties from "./BotProperties";
import Default from "./handler/Default";
import Fill from "./handler/Fill";
import Helper from "../utility/Helper";

export default class Bot {

    constructor(userId: number) {
        User.findByPk(userId)
            .then((user: User) => {
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

                        const loginResponseServer: ILoginResponseServer = loginResponse.servers.find(server => server.Name == `Midgard`);

                        this._network = new Network(this, loginResponseServer.Port, loginResponseServer.IP)
                    }).catch(console.error)
            }).catch(console.error)
    }

    private _network: Network

    public get network(): Network {
        return this._network
    }

    private _properties: BotProperties = new BotProperties()

    public get properties(): BotProperties {
        return this._properties;
    }

    private _user: User = null

    public get user(): User {
        return this._user;
    }

    private _room: Room = new Room(this)

    public get room(): Room {
        return this._room;
    }

    public set room(value: Room) {
        this._room = value;
    }

    private _handler: IHandler

    public get handler(): IHandler {
        return this._handler;
    }

    public set handler(value: IHandler) {
        this._handler = value;
    }

}