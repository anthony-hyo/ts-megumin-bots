export default class BotProperties {

	public token!: string

	public intervalAttack: NodeJS.Timeout | null = null
	public intervalWalk: NodeJS.Timer | null = null

}