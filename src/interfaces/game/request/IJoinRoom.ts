export interface IUser {
	networkId: number;
	username: string;
}

export  interface IJoinRoom {
	cmd: string;
	roomId: number;
	users: IUser[];
}