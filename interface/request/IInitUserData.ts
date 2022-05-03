import {IUser} from "../IUser"

export interface IUsers {
	uid: number
	strFrame: string
	strPad: string
	data: IUser
}

export interface IInitUserData {
	cmd: string
	a: IUsers[]
}