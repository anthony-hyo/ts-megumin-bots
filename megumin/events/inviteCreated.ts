import Megumin from "../Megumin"
import {Invite} from "discord.js"
import Helper from "../../utility/Helper";

module.exports = {
    name: `inviteCreated`,
    once: true,
    async execute(megumin: Megumin, inviteCreated: Invite) {
        await Helper.fetchInvite(inviteCreated)
    },
}
