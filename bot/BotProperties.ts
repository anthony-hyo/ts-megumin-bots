import {Item} from "../interface/request/ILoadInventoryBig";

export default class BotProperties {

	public token!: string

	public intervalAttack: NodeJS.Timeout | null = null
	public intervalWalk: NodeJS.Timer | null = null

	public inventory: Item[] | undefined

}