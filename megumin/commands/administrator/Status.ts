import {GuildMember, Message, MessageEmbed} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";
import logger from "../../../utility/Logger";
import MainMulti from "../../../MainMulti";
import Main from "../../../Main";

export default class Status extends DefaultCommand {

	public readonly name: string = `status`
	public readonly isAdminOnly: boolean = true

	public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
		const embeds: Array<MessageEmbed> = []

		MainMulti.singletons.forEach((main: Main) => {
			embeds.push(new MessageEmbed()
				.setColor('#00f088')
				.setTitle(main.name)
				.addField('Queue', String(main.data.users_queue.size))
				.addField('Connected', String(main.data.bots.size))
				.setTimestamp()
				.setFooter({
					iconURL: 'https://i.imgur.com/lsYvXMT.png',
					text: 'Rem'
				})
			)
		})

		message
			.reply({
				embeds: embeds
			})
			.catch(error => logger.error(`Message send error ${error}`))
	}

}