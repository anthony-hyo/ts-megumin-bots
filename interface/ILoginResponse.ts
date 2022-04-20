import {ILoginResponseServer} from "./ILoginResponseServer";
import {ILoginResponseCharacter} from "./ILoginResponseCharacter";
import {ILoginResponseUser} from "./ILoginResponseUser";

export interface ILoginResponse {
	success: boolean
	user: ILoginResponseUser
	characters: Array<ILoginResponseCharacter>
	servers: Array<ILoginResponseServer>
}

