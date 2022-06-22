import {GuildMember, Message, PermissionResolvable} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class Prefix extends DefaultCommand {

    public readonly name: string = `prefix`
    public readonly description: string = `set bot prefix`
    public readonly helper: string = `(message)`
    public readonly permission: PermissionResolvable | undefined = `ADMINISTRATOR`

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        if (args.length < 1) {
            message.channel
                .send('You must provide a **new prefix**!')
                .catch(error => logger.error(`Message send error ${error}`))
            return
        }

        let prefix: string = args.getStr(0)

        if (prefix.length > 5) {
            message.channel
                .send('Your new prefix must be under `5` characters!')
                .catch(error => logger.error(`Message send error ${error}`))
            return
        }

        guild.prefix = prefix

        guild.save()
            .then(async () =>
                message.channel
                    .send(`The new prefix is now \`${prefix}\``)
                    .catch(error => logger.error(`Message send error ${error}`)))
    }

}