import {Guild, GuildMember, Message, PermissionResolvable} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class Ban extends DefaultCommand {

    public readonly name: string = `ban`
    public readonly description: string = `ban the mentioned user`
    public readonly helper: string = `(mention) || (member id)`
    public readonly permission: PermissionResolvable | undefined = `BAN_MEMBERS`

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        if (message.mentions.members === null) {
            message
                .reply("Please mention a valid member of this server")
                .catch(error => logger.error(`Message send error ${error}`))
            return
        }

        let mention: GuildMember | undefined = message.mentions.members.first()

        if (mention === undefined) {
            message
                .reply("Please mention a valid member of this server")
                .catch(error => logger.error(`Message send error ${error}`))
            return
        }

        if (!mention.bannable) {
            message
                .reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?")
                .catch(error => logger.error(`Message send error ${error}`))
            return
        }

        let reason: string = args.list().slice(1).join(' ')

        if (!reason) {
            reason = "No reason provided"
        }

        let messageGuild: Guild | null = message.guild

        if (messageGuild === null) {
            return
        }

        message.channel
            .send({
                content: `<@${mention.user.id}> has been banned by <@${message.author.id}> because: ${reason}`,
                files: [
                    './assets/images/banned.gif'
                ]
            })
            .catch(error => logger.error(`Message send error ${error}`))
    }

}