import {Guild, User} from "discord.js";
import DiscordUser from "../../database/model/DiscordUser";
import DiscordInvite from "../../database/model/DiscordInvite";

export interface IFormatMessage {
    guild?: Guild
    user?: User

    inviter?: DiscordUser | undefined
    invite?: DiscordInvite | undefined

    channelId?: string
}
