import {GuildMember, Message} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";
import MainMulti from "../../../MainMulti";
import GameUser from "../../../database/model/GameUser";

export default class Queue extends DefaultCommand {

	public readonly name: string = `queue`
	public readonly isAdminOnly: boolean = true

	public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
		let messageFinal: string = ``

		MainMulti.singletons(args.getStr(0).toLowerCase() === 'redhero' ? 'RedHero' : 'RedAQ').queue_users.forEach((gameUser: GameUser) => {
			if (messageFinal.length <= 1700) {
				messageFinal += `\`${gameUser.server}\` ***${gameUser.username}*** as ***${gameUser.handler}***\n`;
			}
		})

		message
			.reply(messageFinal)
			.catch(error => logger.error(`Message send error ${error}`))
	}

}