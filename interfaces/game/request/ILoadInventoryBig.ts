import {IItem} from "../game/IItem";

interface Faction {
	FactionID: number;
	CharFactionID: number;
	sName: string;
	iRep: number;
}

export default interface ILoadInventoryBig {
	cmd: string;

	bankCount: number;

	items: IItem[];
	hitems: IItem[];
	titems: IItem[];

	factions: Faction[];
}