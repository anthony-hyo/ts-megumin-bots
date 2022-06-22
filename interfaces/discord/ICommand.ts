import {GuildMember, Message, PermissionResolvable} from "discord.js";
import Megumin from "../../megumin/Megumin";
import DiscordGuild from "../../database/model/DiscordGuild";
import CommandArg from "../../utility/CommandArg";

export default interface ICommand {

	readonly name: string
	readonly description: string
	readonly helper: string
	readonly cooldown: number
	readonly permission: PermissionResolvable | undefined
	readonly isAdminOnly: boolean | false
	readonly path: string

	handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void

}