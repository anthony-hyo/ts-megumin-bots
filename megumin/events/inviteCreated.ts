import Megumin from "../Megumin"
import {Invite} from "discord.js"
import DiscordInvite from "../../database/model/DiscordInvite";
import logger from "../../utility/Logger";

module.exports = {
	name: `inviteCreated`,
	once: true,
	execute(megumin: Megumin, inviteCreated: Invite) {
		DiscordInvite
			.upsert({
				code: inviteCreated.code,
				inviterId: inviteCreated.inviter ? inviteCreated.inviter.id : null,
				guildId: inviteCreated.guild ? inviteCreated.guild.id : null,

				channelId: inviteCreated.channel.id ? inviteCreated.channel.id : null,
				isDeletable: inviteCreated.deletable,
				createdAt: inviteCreated.createdAt,
				expiresAt: inviteCreated.expiresAt,
				maxAge: inviteCreated.maxAge,
				maxUses: inviteCreated.maxUses,
				isTemporary: inviteCreated.temporary ? inviteCreated.temporary : false,
				uses: inviteCreated.uses,
			})
			.catch(error => logger.error(`[inviteCreated] ${error}`))
	},
}
