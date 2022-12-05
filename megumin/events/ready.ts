import Megumin from "../Megumin";
import logger from "../../utility/Logger";
import {Guild, GuildMember} from "discord.js";
import DiscordGuild from "../../database/model/DiscordGuild";
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
			DiscordGuild
				.upsert({
					guildId: guildDiscord.id,
					shardId: guildDiscord.shardId,
					ownerId: guildDiscord.ownerId,
					name: guildDiscord.name,
					description: guildDiscord.description ? guildDiscord.description : ``
				})
				.catch(error => logger.error(`[ready] ${error}`))

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
						.catch(error => logger.error(`[ready] ${error}`))
				})
				.catch(error => logger.error(`[ready] ${error}`))
		}
	}
}
