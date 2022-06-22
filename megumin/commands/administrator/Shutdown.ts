import {GuildMember, Message} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class Shutdown extends DefaultCommand {

    public readonly name: string = `shutdown`
    public readonly isAdminOnly: boolean = true

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        message
            .reply(":(")
            .catch(error => logger.error(`Message send error ${error}`))

        process.exit()
    }

}