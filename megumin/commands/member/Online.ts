import {Guild, GuildMember, Message} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class Help extends DefaultCommand {

    public readonly name: string = `online`
    public readonly description: string = `show bot member count`

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        const result = megumin.client.guilds.cache.reduce((total: number, guild: Guild) => total + guild.memberCount, 0);

        message.channel
            .send("Count?")
            .then(message1 =>
                message1
                    // @ts-ignore
                    .edit(`Total online on discord is ${result}`))
            .catch(error => logger.error(`Message send error ${error}`))
    }

}