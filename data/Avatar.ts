export default class Avatar {

	public readonly id: number
	public readonly username: string
	public readonly isBot: boolean

	constructor(id: number, username: string, isBot: boolean) {
		this.id = id
		this.username = username
		this.isBot = isBot
	}

}