import {GuildMember, Message} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class Ready extends DefaultCommand {

    public readonly name: string = `say`
    public readonly description: string = `show text entered as the bot`
    public readonly helper: string = `(message)`

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        message.delete().then(r => {
            const msg: string | undefined = args.list().join(" ")

            if (msg == "" || msg === undefined) {
                message
                    .reply("Please enter something for the bot to say.")
                    .catch(error => logger.error(`Message send error ${error}`))
                return
            }

            message.channel
                .send(msg)
                .catch(error => logger.error(`Message send error ${error}`))
        })
    }

}

