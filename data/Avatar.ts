export default class Avatar {

	public readonly networkId: number
	public readonly username: string
	public readonly isBot: boolean

	constructor(networkId: number, username: string, isBot: boolean) {
		this.networkId = networkId
		this.username = username
		this.isBot = isBot
	}

}