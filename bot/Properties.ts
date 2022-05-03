import {IItem} from "../interface/IItem";

export default class Properties {

	public token!: string

	public intervalAttack: NodeJS.Timeout | null = null
	public intervalWalk: NodeJS.Timer | null = null

	public droppedItems: Map<Number, IItem> = new Map<Number, IItem>()

}