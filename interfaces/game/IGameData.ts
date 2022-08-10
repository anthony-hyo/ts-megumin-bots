import Bot from "../../bot/Bot";
import {IMap} from "../web/IGameWorld";
import GameUser from "../../database/model/GameUser";

export interface IGameData {
	bots: Map<number, Bot>
	users_queue: Map<number, GameUser>
	maps: Array<IMap>
	market_items: Map<number, number>
}