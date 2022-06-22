export interface IMap {
	id: number
	Name: string
	ReqLevel: number
}

export interface IGameWorld {
	MapID: number
	x: number
	y: number
	map: IMap
}