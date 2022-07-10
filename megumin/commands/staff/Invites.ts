import {GuildMember, Message, MessageEmbed, PermissionResolvable} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";
import DiscordInvite from "../../../database/model/DiscordInvite";
import DiscordUser from "../../../database/model/DiscordUser";
import {Op} from "sequelize";

export default class Invites extends DefaultCommand {

	public readonly name: string = `invites`
	public readonly description: string = `get server invites`
	public readonly helper: string = `none`
	public readonly permission: PermissionResolvable | undefined = `ADMINISTRATOR`

	public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
		DiscordInvite
			.findAll({
				include: {
					model: DiscordUser,
				},
				where: {
					guildId: guild.guildId,
					uses: {
						[Op.gt]: 0
					}
				},
				order: [
					[ 'uses', 'DESC' ]
				]
			})
			.then((discordInvites: DiscordInvite[]) => {
				const embed: MessageEmbed = new MessageEmbed()
					.setColor('#f00000')
					.setTitle('Ranking')
					.setDescription('Discord invites ranking')
					.setTimestamp()
					.setFooter({
						iconURL: 'https://i.imgur.com/lsYvXMT.png',
						text: 'Rem'
					})

				const invites: Map<string, number> = new Map<string, number>()

				discordInvites.forEach((discordInvite: DiscordInvite) => {
					if (discordInvite.inviterId) {
						const invite: number | undefined = invites.get(discordInvite.inviterId)
						invites.set(discordInvite.inviterId, invite ? invite + discordInvite.uses! : discordInvite.uses!)
					}
				})

				invites.forEach((value: number, key: string) => embed.addField(`${value}x`, `<@${key}>`, true))

				message.channel
					.send({
						embeds: [
							embed
						]
					})
					.catch(error => logger.error(`Message send error ${error}`))
			})
	}

}