import {GuildMember, Message} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class NHentai extends DefaultCommand {

    public readonly name: string = `nh`
    public readonly description: string = `show link for the nhentai number`
    public readonly helper: string = `(number)`

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        const nh: Number = args.getInt(0)

        message.channel
            .send(`https://nhentai.net/g/${nh}`)
            .catch(error => logger.error(`Message send error ${error}`))
    }

}