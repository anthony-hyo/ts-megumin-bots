import {GuildMember, Message} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class Poor extends DefaultCommand {

    public readonly name: string = `poor`
    public readonly helper: string = `(mention)`

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        message
            .delete()
            .then(() => {
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

                message.channel
                    .send({
                        content: `${mention.toString()}`,
                        files: [
                            './assets/videos/pobre.mp4'
                        ]
                    })
                    .catch(error => logger.error(`Message send error ${error}`))
            })
            .catch(error => logger.error(`Delete message error ${error}`))
    }

}