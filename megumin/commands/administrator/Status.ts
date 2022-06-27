import {GuildMember, Message} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class Status extends DefaultCommand {

	public readonly name: string = `status`
	public readonly isAdminOnly: boolean = true

	public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
	}

}