import Megumin from "../Megumin";
import logger from "../../utility/Logger";
import Helper from "../../utility/Helper";
import {Guild} from "discord.js";

module.exports = {
    name: `ready`,
    once: true,
    async execute(megumin: Megumin) {
        logger.info('Connected to Discord!')
        logger.info(`Ready to serve in ${megumin.client.channels.cache.size} channels on ${megumin.client.guilds.cache.size} servers, for a total of ${megumin.client.users.cache.size} users.`)

        const result = megumin.client.guilds.cache.reduce((total: number, guild: Guild) => total + guild.memberCount, 0);

       megumin.client.user?.setActivity(`${result} users`, {type: 'PLAYING'})

        for (const [, guildDiscord] of megumin.client.guilds.cache) {
            Helper.fetchGuild(guildDiscord)
                .then(() => Helper.fetchInviteAll(guildDiscord))
        }
    }
}
