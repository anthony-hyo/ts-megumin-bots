import {GuildMember, Message, PermissionResolvable, TextBasedChannelFields} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class Purge extends DefaultCommand {

    public readonly name: string = `purge`
    public readonly description: string = `delete a certain number of messages`
    public readonly helper: string = `(number)`
    public readonly cooldown: number = 2
    public readonly permission: PermissionResolvable | undefined = `MANAGE_MESSAGES`

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        if (args.length < 1) {
            message.channel
                .send('You must provide **quantity to delete**')
                .catch(error => logger.error(`Message send error ${error}`))
            return
        }

        const toDelete: number = args.getInt(0)

        if (toDelete < 1 || toDelete > 100) {
            message
                .reply("Please provide a number between 1 and 100 for the number of messages to delete")
                .catch(error => logger.error(`Message send error ${error}`))
            return
        }

        (message.channel.messages.channel as TextBasedChannelFields)
            .bulkDelete(toDelete, true)
            .then(() => message.channel.send(`Successfully delete ${(toDelete - 1)}`))
            .catch(error => {
                logger.error(`Message send error ${error}`)
                message.channel.send(`Couldn't delete messages because of: ${error}`)
                    .catch(error => logger.error(`Message send error ${error}`))
            })
    }

}
