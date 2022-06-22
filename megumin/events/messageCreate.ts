import {GuildMember, Message, PermissionResolvable} from "discord.js"
import DiscordGuild from "../../database/model/DiscordGuild";
import Megumin from "../Megumin";
import logger from "../../utility/Logger";
import MainMulti from "../../MainMulti";
import ICommand from "../../interfaces/discord/ICommand";
import {ICooldown} from "../../interfaces/discord/ICooldown";
import Helper from "../../utility/Helper";
import CommandArg from "../../utility/CommandArg";

module.exports = {
    name: `messageCreate`,
    execute(megumin: Megumin, message: Message) {
        if (message.content.length > 0) {
            logger.debug(`Message ${message.guild?.name}(${message.guild?.id}) ${message.channel.id} ${message.author.tag}(${message.author.id}): ${message.content}`)
        }

        if (message.channel.type === "DM" || message.author.bot) {
            return
        }


        if (message.channel.type === 'GUILD_TEXT') {
            MainMulti.singleton.seeborgDiscord.onMessage(message)
        }

        DiscordGuild
            .findOrCreate({
                where: {
                    guildId: Number(message.guild?.id),
                }
            })
            .then(([discordGuild]: [DiscordGuild, boolean]) => {
                if (!message.content.startsWith(discordGuild.prefix)) {
                    return
                }

                const args: string[] = message.content.slice(discordGuild.prefix.length).trim().split(/\s+/)//.trim().split(/ +/g)

                let commandName: string | undefined = args.shift()

                if (commandName === undefined) {
                    return
                }

                const command: ICommand | undefined = megumin.getCommand(commandName)

                if (command !== undefined) {
                    let member: GuildMember | null = message.member

                    if (member == null) {
                        return
                    }

                    message.channel.sendTyping()

                    if (command.permission) {
                        // @ts-ignore
                        let authorPerms = message.channel.permissionsFor(message.author)

                        if (!authorPerms || !authorPerms.has(<PermissionResolvable>command.permission)) {
                            message
                                .reply('You can not do this!')
                                .catch(error => logger.error(`Message send error ${error}`))
                            return
                        }
                    }

                    if (command.isAdminOnly && !MainMulti.singleton.config.administrator.includes(member.user.id)) {
                        message
                            .reply('You can not do this!')
                            .catch(error => logger.error(`Message send error ${error}`))
                        return
                    }

                    let cooldown: ICooldown | undefined = megumin.cooldown(member.id, commandName)

                    let now: number = new Date().getMilliseconds()

                    if (cooldown != undefined && cooldown.timeout >= now) {
                        let timeLeft: string = Helper.millisecondsToStr(cooldown.timeout - now)
                        message.reply(`please wait \`${timeLeft}\` before reusing the \`${command.name}\` command.`)
                            .catch(error => logger.error(`Message send error ${error}`))
                        return
                    }

                    let commandCooldown = (command.cooldown || 2) * 1000

                    megumin.cooldowns.push({
                        command: commandName,
                        userId: member.id,
                        timeout: now + commandCooldown
                    })

                    let userId = member.id

                    setTimeout(() => {
                        megumin.cooldowns.forEach((value, index) => {
                            if (value.userId === userId && value.command === commandName) {
                                megumin.cooldowns.splice(index, 1)
                            }
                        })
                    }, commandCooldown)

                    command.handler(megumin, message, member, discordGuild, CommandArg.parse(args))
                } else {
                    logger.error(`Command not found ${commandName}`)
                }
            })
    },
}
