import {Message, NewsChannel, PermissionResolvable, TextChannel, ThreadChannel} from "discord.js"
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

		const channel: TextChannel | ThreadChannel | NewsChannel = message.channel as TextChannel | ThreadChannel | NewsChannel

		DiscordGuild
			.findOrCreate({
				where: {
					guildId: message.guild?.id,
				}
			})
			.then(([discordGuild]: [DiscordGuild, boolean]) => {
				if (!message.content.startsWith(discordGuild.prefix)) {
					return
				}

				const args: string[] = message.content.slice(discordGuild.prefix.length).trim().split(/\s+/)//.trim().split(/ +/g)

				const commandName: string | undefined = args.shift()

				if (commandName === undefined) {
					return
				}

				const command: ICommand | undefined = megumin.getCommand(commandName)

				if (command !== undefined) {
					if (message.member == null) {
						return
					}

					channel.sendTyping()

					if (command.permission) {
						const authorPerms = channel.permissionsFor(message.author)

						if (!authorPerms || !authorPerms.has(<PermissionResolvable>command.permission)) {
							message
								.reply('You can not do this!')
								.catch(error => logger.error(`Message send error 1 ${error}`))
							return
						}
					}

					/**
					 * Cooldown
					 */
					if (!MainMulti.singleton.config.administrator.includes(message.member.user.id)) {
						if (command.isAdminOnly) {
							message
								.reply('You can not do this!')
								.catch(error => logger.error(`Message send error 2 ${error}`))
							return
						}

						const cooldown: ICooldown | undefined = megumin.cooldown(message.member.id, commandName)

						const now: number = new Date().getTime()

						if (cooldown && cooldown.timeout >= now) {
							const timeLeft: string = Helper.millisecondsToStr(cooldown.timeout - now)
							message
								.reply(`please wait \`${timeLeft}\` before reusing the \`${command.name}\` command.`)
								.catch(error => logger.error(`Message send error 3 ${error}`))
							return
						}

						const commandCooldown = (command.cooldown || 2) * 1000

						megumin.cooldowns.push({
							command: commandName,
							userId: message.member.id,
							timeout: now + commandCooldown
						})

						const userId: string = message.member.id

						setTimeout(() => {
							megumin.cooldowns.forEach((value, index) => {
								if (value.userId === userId && value.command === commandName) {
									megumin.cooldowns.splice(index, 1)
								}
							})
						}, commandCooldown)
					}

					command.handler(megumin, message, message.member, discordGuild, CommandArg.parse(args))
				} else {
					logger.warn(`[messageCreate] command not found ${commandName}`)
				}
			})
			.catch(error => logger.error(`[messageCreate] 4 ${error}`))

		MainMulti.singleton.seeborgDiscord.onMessage(message)
	},
}
