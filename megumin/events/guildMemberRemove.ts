import Megumin from "../Megumin"
import {GuildMember, TextChannel} from "discord.js"
import DiscordGuild from "../../database/model/DiscordGuild";
import DiscordUser from "../../database/model/DiscordUser";
import Helper from "../../utility/Helper";
import DiscordLogInvite from "../../database/model/DiscordLogInvite";
import logger from "../../utility/Logger";
import {Sequelize} from "sequelize";

module.exports = {
	name: `guildMemberRemove`,
	execute: async function (rem: Megumin, member: GuildMember) {
		DiscordGuild
			.upsert({
				guildId: member.guild.id,
				shardId: member.guild.shardId,
				ownerId: member.guild.ownerId,
				name: member.guild.name,
				description: member.guild.description ? member.guild.description : ``
			})
			.then(([discordGuild]: [DiscordGuild, (boolean | null)]) => {
				const channel: TextChannel = member.guild.channels.cache.get(discordGuild.leaveChannelId) as TextChannel

				if (channel) {
					DiscordUser
						.upsert({
							userId: member.user.id,
							username: member.user.username,
							discriminator: member.user.discriminator,
							isBot: member.user.bot,
							avatar: member.user.avatar,
							createdAt: member.user.createdAt
						})
						.then(([invitedData]: [DiscordUser, (boolean | null)]) => {
							DiscordLogInvite
								.findOne({
									include: {
										model: DiscordUser,
									},
									where: {
										guildId: member.guild.id,
										userId: member.user.id,
									},
									order: Sequelize.literal(`DESC`)
								})
								.then((discordLogInvite: DiscordLogInvite | null) => {
									DiscordLogInvite
										.create({
											guildId: member.guild.id,
											userId: invitedData.userId,
											inviteCode: discordLogInvite ? discordLogInvite.inviteCode : null,
											type: `leave`,
										})
										.then(() => {
											channel.send(
												Helper.formatMessage(discordGuild.leaveMessage, {
													guild: member.guild,
													user: member.user,

													inviter: discordLogInvite ? discordLogInvite.invite.inviter : undefined,
													invite: discordLogInvite ? discordLogInvite.invite : undefined,

													channelId: discordGuild.leaveChannelId
												})
											).catch(error => logger.error(`Message send error ${error}`))
										})
										.catch(error => logger.error(`[guildMemberAdd] ${error}`))
								})
								.catch(error => logger.error(`[guildMemberAdd] ${error}`))

						})
						.catch(error => logger.error(`[guildMemberAdd] ${error}`))
				}
			})
			.catch(error => logger.error(`[guildMemberRemove] ${error}`))
	},
}
