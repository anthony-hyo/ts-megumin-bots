import Megumin from "../Megumin";
import logger from "../../utility/Logger";
import {Collection, Guild, GuildMember, Invite as InviteDiscord} from "discord.js";
import DiscordGuild from "../../database/model/DiscordGuild";
import DiscordInvite from "../../database/model/DiscordInvite";
import DiscordUser from "../../database/model/DiscordUser";

module.exports = {
	name: `ready`,
	once: true,
	execute(megumin: Megumin) {
		logger.info('Connected to Discord!')

		const result: number = megumin.client.guilds.cache.reduce((total: number, guild: Guild) => total + guild.memberCount, 0);

		logger.info(`Ready to serve in ${megumin.client.channels.cache.size} channels on ${megumin.client.guilds.cache.size} servers, for a total of ${result} users.`)

		megumin.client.user?.setActivity(`${result} users`, {type: 'PLAYING'})

		for (const [, guildDiscord] of megumin.client.guilds.cache) {
			guildDiscord
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
									guildId: guildDiscord.id,
									shardId: guildDiscord.shardId,
									ownerId: guildDiscord.ownerId,
									name: guildDiscord.name,
									description: guildDiscord.description ? guildDiscord.description : ``
								})
								.then(([discordGuild]: [DiscordGuild, (boolean | null)]) => {
									if (guildDiscord.me && guildDiscord.me.permissions.has("MANAGE_GUILD")) {
										guildDiscord.invites
											.fetch()
											.then((guildInvites: Collection<string, InviteDiscord>) => {
												guildInvites
													.forEach(guildInvite => {
														let discordInviteData: any = {
															code: guildInvite.code,
															inviterId: null,
															guildId: guildInvite.guild ? guildInvite.guild.id : null,

															channelId: guildInvite.channel.id ? guildInvite.channel.id : null,
															isDeletable: guildInvite.deletable,
															createdAt: guildInvite.createdAt,
															expiresAt: guildInvite.expiresAt,
															maxAge: guildInvite.maxAge,
															maxUses: guildInvite.maxUses,
															isTemporary: guildInvite.temporary ? guildInvite.temporary : false,
															uses: guildInvite.uses,
														}

														if (guildInvite.inviter) {
															discordInviteData.inviterId = guildInvite.inviter.id

															DiscordUser
																.upsert({
																	userId: guildInvite.inviter.id,
																	username: guildInvite.inviter.username,
																	discriminator: guildInvite.inviter.discriminator,
																	isBot: guildInvite.inviter.bot,
																	avatar: guildInvite.inviter.avatar,
																	createdAt: guildInvite.inviter.createdAt
																})
																.then(([discordUser, created]: [DiscordUser, (boolean | null)]) => {
																	DiscordInvite
																		.upsert(discordInviteData)
																		.catch(error => {
																			logger.error(`[ready] x`, error);
																			console.log(discordInviteData)
																		})
																})
																.catch(error => logger.error(`[ready] ${error}`))
														} else {
															DiscordInvite
																.upsert(discordInviteData)
																.catch(error => {
																	logger.error(`[ready] y`, error);
																	console.log(discordInviteData)
																})
														}
													})
											})
											.catch(error => logger.error(`[ready] ${error}`))
									}
								})
								.catch(error => logger.error(`[ready] ${error}`))
						})
						.catch(error => logger.error(`[ready] ${error}`))
				})
				.catch(error => logger.error(`[ready] ${error}`))
		}
	}
}
