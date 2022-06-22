import {
	Collection,
	GuildAuditLogs,
	GuildMember,
	Invite as InviteDiscord,
	TextChannel,
	User,
	User as UserDiscord
} from "discord.js"
import logger from "../../utility/Logger"
import Helper from "../../utility/Helper"
import Megumin from "../Megumin";
import DiscordGuild from "../../database/model/DiscordGuild";
import DiscordInvite from "../../database/model/DiscordInvite";
import DiscordLogInvite from "../../database/model/DiscordLogInvite";
import {IFormatMessage} from "../../interfaces/discord/IFormatMessage";

module.exports = {
    name: `guildMemberAdd`,
    async execute(rem: Megumin, member: GuildMember) {
        let guild = member.guild

        if (!guild.me) {
            return
        }

        if (!guild.me.permissions.has("MANAGE_GUILD")) {
            logger.warn(`Bot does not have "MANAGE_GUILD" permission on guild ${guild.name}(${guild.id})`)
            return
        }

        let guildData: DiscordGuild = await Helper.fetchGuild(guild)

        let channel: TextChannel = guild.channels.cache.get(guildData.joinChannelId) as TextChannel

        if (!channel) {
            return
        }

        const invitesGuild: Collection<string, InviteDiscord> = await guild.invites.fetch()

        let invites = await DiscordInvite.findAll({
            where: {
                guildId: guild.id
            }
        })

        let inviteType: string = "normal"

        let inviteDiscordUsed: InviteDiscord | undefined = invitesGuild.find((inviteGuild: InviteDiscord) => {
            let invite2: DiscordInvite | undefined = invites.find((invite) => invite.code === inviteGuild.code)
            return invite2 !== undefined && invite2.uses != null && inviteGuild.uses != null && invite2.uses < inviteGuild.uses
        })

        let inviteCodeUsed: string | null = inviteDiscordUsed ? inviteDiscordUsed.code : null

        if ((Helper.isEqual(invitesGuild.map((i: { code: any; uses: any }) => `${i.code}|${i.uses}`).sort(), invites.map((i) => `${i.code}|${i.uses}`).sort())) && member.guild.features.includes("VANITY_URL")) {
            inviteType = 'vanity'
        }

        let inviter: UserDiscord | null = null

        if (member.user.bot) {
            if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
                let inviterDiscord: User | null | undefined = await member.guild.fetchAuditLogs({type: "BOT_ADD"})
                    .then((value: GuildAuditLogs<"BOT_ADD">) => value.entries.first()?.executor)

                if (inviterDiscord !== null && inviterDiscord !== undefined) {
                    await Helper.fetchUser({
                        userId: inviterDiscord.id,
                        user: inviterDiscord
                    })

                    inviter = inviterDiscord
                }
            }
            inviteType = 'oauth'
        }

        if (inviteDiscordUsed && inviteDiscordUsed.inviter && !member.user.bot) {
            inviter = inviteDiscordUsed.inviter
        }

        let invitedData = await Helper.fetchUser({
            userId: member.user.id,
            user: member.user
        })

        await DiscordLogInvite.create({
            guildId: guild.id,
            userId: invitedData.userId,
            inviteCode: inviteCodeUsed,
            type: "join",
        })

        let inviteUsed: DiscordInvite | undefined = undefined

        if (inviteDiscordUsed !== undefined) {
            //TODO: Replace with fetchAll??

            /*let inviteUpdate: { inviteType: string } = {
                inviteType: inviteType
            }

            if (inviteDiscordUsed && inviteDiscordUsed.uses) {
                Object.assign(inviteUpdate, {
                    uses: inviteDiscordUsed.uses
                })
            }

            let [, Invites]: [number, Invite[]] = await Invite.update(inviteUpdate,
                {
                    where: {
                        code: inviteCodeUsed
                    }
                })*/

            inviteUsed = await Helper.fetchInvite(inviteDiscordUsed)
        }

        let formatMessage: IFormatMessage = {
            guild: member.guild,
            user: member.user,

            inviter: inviter === null ? undefined : inviter,
            invite: inviteUsed,

            channelId: inviteDiscordUsed === undefined ? undefined : inviteDiscordUsed.channel.id || undefined
        }

        switch (inviteType) {
            case 'normal':
                channel.send(
                    await Helper.formatMessage(guildData.joinMessage, formatMessage)
                        .catch(error => logger.error(`Format error ${error}`))
                ).catch(error => logger.error(`Message send error ${error}`))
                break
            case 'vanity':
                channel.send(
                    await Helper.formatMessage(`{user} joined using the server's custom link.`, formatMessage)
                        .catch(error => logger.error(`Format error ${error}`))
                ).catch(error => logger.error(`Message send error ${error}`))
                break
            case 'oauth':
                if (inviter) {
                    channel.send(
                        await Helper.formatMessage(`{user} joined using the OAuth2 feed, added by {invite.tag}.`, formatMessage)
                            .catch(error => logger.error(`Format error ${error}`))
                    ).catch(error => logger.error(`Message send error ${error}`))
                } else {
                    channel.send(
                        await Helper.formatMessage(`It's impossible to recover how the {user} robot has joined.`, formatMessage)
                            .catch(error => logger.error(`Format error ${error}`))
                    ).catch(error => logger.error(`Message send error ${error}`))
                }
                break
        }

        if (inviteDiscordUsed !== undefined) {
            await Helper.fetchInvite(inviteDiscordUsed)
        }
    },
}

