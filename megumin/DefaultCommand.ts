import ICommand from "../interfaces/discord/ICommand";
import Megumin from "./Megumin";
import {GuildMember, Message, PermissionResolvable} from "discord.js";
import DiscordGuild from "../database/model/DiscordGuild";
import CommandArg from "../utility/CommandArg";

export default class DefaultCommand implements ICommand {

	public readonly name: string = `default`
	public readonly description: string = `none`
	public readonly helper: string = `none`
	public readonly cooldown: number = 5
	public readonly permission: PermissionResolvable | undefined
	public readonly isAdminOnly: boolean = false
	public readonly path: string = ``

	public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
	}

}