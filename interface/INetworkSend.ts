export interface INetworkSend {
	type: string
	body: {
		cmd: string
		args: Array<any>
	}
}