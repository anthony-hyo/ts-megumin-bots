import {Collection, GuildAuditLogs, GuildAuditLogsEntry, GuildMember, Invite, TextChannel, User,} from "discord.js"
import logger from "../../utility/Logger"
import Helper from "../../utility/Helper"
import Megumin from "../Megumin";
import DiscordGuild from "../../database/model/DiscordGuild";
import DiscordInvite from "../../database/model/DiscordInvite";
import DiscordLogInvite from "../../database/model/DiscordLogInvite";
import {IFormatMessage} from "../../interfaces/discord/IFormatMessage";
import DiscordUser from "../../database/model/DiscordUser";

module.exports = {
	name: `guildMemberAdd`,
	execute(rem: Megumin, member: GuildMember) {
		if (!member.guild.me) {
			return
		}

		if (!member.guild.me.permissions.has("MANAGE_GUILD")) {
			logger.warn(`Bot does not have "MANAGE_GUILD" permission on guild ${member.guild.name}(${member.guild.id})`)
			return
		}

		member.guild
			.fetchOwner()
			.then((guildOwner: GuildMember) => {
				DiscordUser
					.upsert({
						userId: guildOwner.user.id,
						username: guildOwner.user.username,
						discriminator: guildOwner.user.discriminator,
						isBot: guildOwner.user.bot,
						avatar: guildOwner.user.avatar,
						createdAt: guildOwner.user.createdAt
					})
					.then(() => {
						DiscordGuild
							.upsert({
								guildId: member.guild.id,
								shardId: member.guild.shardId,
								ownerId: member.guild.ownerId,
								name: member.guild.name,
								description: member.guild.description ? member.guild.description : ``
							})
							.then(([discordGuild]: [DiscordGuild, (boolean | null)]) => {
								const channel: TextChannel = member.guild.channels.cache.get(discordGuild.joinChannelId) as TextChannel

								if (!channel) {
									return
								}

								member.guild.invites
									.fetch()
									.then((invitesGuild: Collection<string, Invite>) => {
										DiscordInvite
											.findAll({
												where: {
													guildId: member.guild.id
												}
											})
											.then(discordInvites => {
												let inviteType: `normal` | `oauth` | `vanity` = `normal`

												const inviteDiscordUsed: Invite | undefined = invitesGuild.find((inviteGuild: Invite) => {
													const invite2: DiscordInvite | undefined = discordInvites.find((invite) => invite.code === inviteGuild.code)
													return invite2 !== undefined && invite2.uses != null && inviteGuild.uses != null && invite2.uses < inviteGuild.uses
												})

												let inviteCodeUsed: string | null = inviteDiscordUsed ? inviteDiscordUsed.code : null

												if ((Helper.isEqual(invitesGuild.map((i: { code: any; uses: any }) => `${i.code}|${i.uses}`).sort(), discordInvites.map((i) => `${i.code}|${i.uses}`).sort())) && member.guild.features.includes("VANITY_URL")) {
													inviteType = `vanity`
												}

												//TODO: upsert inviter
												let inviter: User | null = null

												if (member.user.bot && member.guild.me) {
													if (member.guild.me.permissions.has("VIEW_AUDIT_LOG")) {
														member.guild
															.fetchAuditLogs({type: "BOT_ADD"})
															.then((value: GuildAuditLogs<"BOT_ADD">) => {
																const log: GuildAuditLogsEntry<"BOT_ADD"> | undefined = value.entries.find(value => value.target?.id === member.user.id)

																if (log) {
																	inviter = log.executor
																}
															})
															.catch(error => logger.error(`[guildMemberAdd] ${error}`))
													}

													inviteType = `oauth`
												} else if (inviteDiscordUsed && inviteDiscordUsed.inviter) {
													inviter = inviteDiscordUsed.inviter
												}

												if (inviter) {
													DiscordUser
														.upsert({
															userId: inviter.id,
															username: inviter.username,
															discriminator: inviter.discriminator,
															isBot: inviter.bot,
															avatar: inviter.avatar,
															createdAt: inviter.createdAt
														})
														.catch(error => logger.error(`[guildMemberAdd] ${error}`))
												}

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
															.create({
																guildId: member.guild.id,
																userId: invitedData.userId,
																inviteCode: inviteCodeUsed,
																type: inviteType,
															})
															.then((discordLogInvite: DiscordLogInvite) => {
																if (inviteDiscordUsed !== undefined) {
																	DiscordInvite
																		.upsert({
																			code: inviteDiscordUsed.code,
																			inviterId: inviteDiscordUsed.inviter ? inviteDiscordUsed.inviter.id : null,
																			guildId: inviteDiscordUsed.guild ? inviteDiscordUsed.guild.id : null,

																			channelId: inviteDiscordUsed.channel.id ? inviteDiscordUsed.channel.id : null,
																			isDeletable: inviteDiscordUsed.deletable,
																			createdAt: inviteDiscordUsed.createdAt,
																			expiresAt: inviteDiscordUsed.expiresAt,
																			maxAge: inviteDiscordUsed.maxAge,
																			maxUses: inviteDiscordUsed.maxUses,
																			isTemporary: inviteDiscordUsed.temporary ? inviteDiscordUsed.temporary : false,
																			uses: inviteDiscordUsed.uses,
																		})
																		.then(([inviteUsed]: [DiscordInvite, (boolean | null)]) => {
																			const formatMessage: IFormatMessage = {
																				guild: member.guild,
																				user: member.user,

																				inviter: discordLogInvite.invite.inviter,
																				invite: discordLogInvite.invite,

																				channelId: inviteDiscordUsed === undefined ? undefined : inviteDiscordUsed.channel.id || undefined
																			}

																			switch (inviteType) {
																				case 'normal':
																					channel
																						.send(Helper.formatMessage(discordGuild.joinMessage, formatMessage))
																						.catch(error => logger.error(`Message send error ${error}`))
																					break
																				case 'vanity':
																					channel
																						.send(Helper.formatMessage(`{user} joined using the server's custom link.`, formatMessage))
																						.catch(error => logger.error(`Message send error ${error}`))
																					break
																				case 'oauth':
																					if (inviter) {
																						channel
																							.send(Helper.formatMessage(`{user} joined using the OAuth2 feed, added by {invite.tag}.`, formatMessage))
																							.catch(error => logger.error(`Message send error ${error}`))
																					} else {
																						channel
																							.send(Helper.formatMessage(`It's impossible to recover how the {user} robot has joined.`, formatMessage))
																							.catch(error => logger.error(`Message send error ${error}`))
																					}
																					break
																			}
																		})
																		.catch(error => logger.error(`[guildMemberAdd] ${error}`))
																}
															})
															.catch(error => logger.error(`[guildMemberAdd] ${error}`))
													})
													.catch(error => logger.error(`[guildMemberAdd] ${error}`))
											})
											.catch(error => logger.error(`[guildMemberAdd] ${error}`))

									})
									.catch(error => logger.error(`[guildMemberAdd] ${error}`))

							})
							.catch(error => logger.error(`[guildMemberAdd] ${error}`))
					})
					.catch(error => logger.error(`[guildMemberAdd] ${error}`))
			})
			.catch(error => logger.error(`[guildMemberAdd] ${error}`))
	},
}

