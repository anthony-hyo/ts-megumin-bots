import Megumin from "../Megumin"
import {GuildMember, TextChannel} from "discord.js"
import DiscordGuild from "../../database/model/DiscordGuild";
import DiscordUser from "../../database/model/DiscordUser";
import Helper from "../../utility/Helper";
import DiscordLogInvite from "../../database/model/DiscordLogInvite";
import logger from "../../utility/Logger";

module.exports = {
    name: `guildMemberRemove`,
    execute: async function (rem: Megumin, member: GuildMember) {
        let guild = member.guild

        const guildData: DiscordGuild = await Helper.fetchGuild(guild)

        let channel: TextChannel = guild.channels.cache.get(guildData.leaveChannelId) as TextChannel

        if (channel) {
            const invitedData: DiscordUser = await Helper.fetchUser({
                userId: member.user.id,
                user: member.user
            })

            await DiscordLogInvite.create({
                guildId: guild.id,
                userId: invitedData.userId,
                inviteCode: null,
                type: "leave",
            })

            channel.send(
                await Helper.formatMessage(guildData.leaveMessage, {
                    guild: member.guild,
                    user: member.user,

                    //TODO: Find invite used and inviter
                    //inviter: inviter === null ? undefined : inviter,
                    //invite: inviteUsed,

                    channelId: guildData.leaveChannelId
                })
            ).catch(error => logger.error(`Message send error ${error}`))
        }
    },
}
