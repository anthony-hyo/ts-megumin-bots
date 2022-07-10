import {GuildMember, Message} from "discord.js";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";
import {exec} from "child_process";
import Helper from "../../../utility/Helper";
import Shutdown from "./Shutdown";

export default class Restart extends Shutdown {

    public readonly name: string = `r`

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        message
            .reply(this.messages[Helper.randomIntegerInRange(0, this.messages.length - 1)])
            .then(() => {
                exec('START start.bat')
                process.exit(1);
            })
            .catch(error => logger.error(`Message send error ${error}`))
    }

}