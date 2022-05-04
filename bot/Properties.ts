import {IItem} from "../interface/IItem";

export default class Properties {

	public token!: string

	private _intervalAttack: NodeJS.Timeout | null = null
	private _intervalWalk: NodeJS.Timer | null = null

	public droppedItems: Map<Number, IItem> = new Map<Number, IItem>()

	public wasOnWorldBoss: boolean = false

	public set intervalAttack(value: NodeJS.Timeout | null) {
		this._intervalAttack = value;
	}

	public set intervalWalk(value: NodeJS.Timer | null) {
		this._intervalWalk = value;
	}

	public clearAttack(): void {
		if (this._intervalAttack != null) {
			clearInterval(this._intervalAttack)
		}
	}

	public clearWalk(): void {
		if (this._intervalWalk != null) {
			clearInterval(this._intervalWalk)
		}
	}

	public clearAllInterval(): void {
		this.clearAttack()
		this.clearWalk()
	}

}