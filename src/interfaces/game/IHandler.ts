import Avatar from "../../bot/data/Avatar";
import {IItem} from "./IItem";
import ILoadInventoryBig from "./request/ILoadInventoryBig";
import {IRemoveItem} from "./request/IRemoveItem";
import {IMarket} from "./request/IMarket";

export interface IHandler {

	onJoin(): void

	onInventoryLoad(data: ILoadInventoryBig): void

	onDropItem(item: IItem): void

	onRemoveItem(data: IRemoveItem): void;

	onDamageTaken(): void

	onMarketLoad(data: IMarket): void

	onMarketRetrieveLoad(data: IMarket): void

	onDeath(): void;

	onSpawn(): void;

	/*
		Connection
	 */
	onConnect(): void;

	onDisconnect(): void;

	/*
		User
	 */
	onUserJoin(networkId: number): void

	onUserLeave(networkId: number): void

	onUserMoveToCell(username: string, frame: string):void

	onUserMessage(channel:string, username: string, message: string): void

	/*
		Monster
	 */
	onWorldBoss(data: any): void

	/*
		NPC
	 */
	//TODO:..

	/*
		Avatar
	 */
	onTargetDeath(avatar: Avatar): void

}