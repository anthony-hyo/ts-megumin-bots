import Avatar from "../data/Avatar";
import IMoveToArea from "./request/IMoveToArea";
import ILoadInventoryBig from "./request/ILoadInventoryBig";
import {IMarket} from "./request/IMarket";
import {IRemoveItem} from "./request/IRemoveItem";

export interface IHandler {

	onJoin(data: IMoveToArea): void

	onInventoryLoad(data: ILoadInventoryBig): void

	onDropItem(): void

	onRemoveItem(data: IRemoveItem): void;

	onDamageTaken(): void

	onMarketLoad(data: IMarket): void

	onMarketRetrieveLoad(data: IMarket): void

	/*
		User
	 */
	onUserJoin(networkId: number): void

	onUserLeave(networkId: number): void

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