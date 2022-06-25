import {GuildMember, Message} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";
import {exec} from "child_process";
import Helper from "../../../utility/Helper";

export default class Restart extends DefaultCommand {

    public readonly name: string = `restart`
    public readonly cooldown: number = 1
    public readonly isAdminOnly: boolean = true

    private readonly messages: Array<string> = [
        `W-Wait a moment!`,
        `Excuse me, but I think I'm slowly being swallowed.`,
        `Could you rescue me now, please?`,
        `I mean, it's strange that you never gave your name.`,
        `This must be one of those "Hey, it's me!" scams that Kazuma described before.`,
        `Anyway, this is Yunyun.\nhttps://tenor.com/view/konosuba-yun-yun-blush-embarrassed-flustered-gif-7587651`,
        `I'd rather not. It's too cold.`,
        `No.`,
        `I said no.`,
        `Not happening.`,
        `Very well, then.\nhttps://tenor.com/view/megumin-smile-evil-smile-konosuba-gif-5812171`,
        `I can no longer use my magic today.\nhttps://discord.com/channels/325896240145367040/683773874529239078/990058098079191070`,
        `My name is Megumin!\nhttps://tenor.com/view/konosuba-megumin-satou-kazuma-aqua-anime-gif-14523564`,
        `Do you, too, desire my forbidden strength.\nhttps://tenor.com/view/konosuba-megumin-gif-6228268`,
        `I'll grab you with both arms.`,
        `I haven't eaten anything in three days.\nhttps://tenor.com/view/shock-megumin-shocked-gif-19636409`,
        `We're friends, aren't we?\nhttps://tenor.com/view/sport-outfit-school-konosuba-megumin-gif-24226172`,
        `C'mon. C'mon. C'mon.`,
    ]

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