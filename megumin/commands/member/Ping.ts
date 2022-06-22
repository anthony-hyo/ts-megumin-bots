import {GuildMember, Message} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class NHentai extends DefaultCommand {

    public readonly name: string = `ping`
    public readonly description: string = `get a simple pong response`

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        message.channel
            .send("Ping?")
            .then(message1 =>
                message1
                    .edit(`Pong! Latency is ${message1.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(megumin.client.ws.ping)}ms`))
            .catch(error => logger.error(`Message send error ${error}`))
    }

}