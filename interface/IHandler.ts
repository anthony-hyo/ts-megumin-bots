import Avatar from "../data/Avatar";
import IMoveToArea from "./request/IMoveToArea";
import ILoadInventoryBig from "./request/ILoadInventoryBig";

export interface IHandler {

	onJoin(data: IMoveToArea): void

	onInventoryLoad(data: ILoadInventoryBig): void

	onDropItem(): void

	onDamageTaken(): void

	/*
		User
	 */
	onUserJoin(networkId: number): void

	onUserLeave(networkId: number): void

	/*
		Monster
	 */
	onWorldBoss(data: any): void;

	/*
		NPC
	 */
	//TODO:..

	/*
		Avatar
	 */
	onTargetDeath(avatar: Avatar): void

}