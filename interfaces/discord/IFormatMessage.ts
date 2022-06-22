import {Guild, User} from "discord.js";
import Invite from "../../../bot/src/database/model/discord/Invite";

export interface IFormatMessage {
    guild?: Guild
    user?: User

    inviter?: User
    invite?: Invite

    channelId?: string
}
