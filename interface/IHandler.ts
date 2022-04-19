import Avatar from "../data/Avatar";
import {IMoveToArea} from "./request/MoveToArea";
import ILoadInventoryBig from "./request/Item";

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
    //TODO:..

    /*
        NPC
     */
    //TODO:..

    /*
        Avatar
     */
    onTargetDeath(avatar: Avatar): void

}