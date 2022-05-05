import Fill from "./Fill";
import Helper from "../../utility/Helper";
import logger from "../../utility/Logger";
import Avatar from "../../data/Avatar";

export default class PvP extends Fill {

	onJoin(): void {
		super.onJoin()

		if (this.bot.room.data.strMapName.includes('doomarena')) {
			this.bot.properties.isOnWarZoneQueue = false

			const pad: number = this.bot.room.data.pvpTeam == 0 ? 2 : 1
			setTimeout(() => this.bot.network.send("mtcid", [pad]), 1500)
		} else if (!this.bot.properties.isOnWarZoneQueue) {
			logger.info(`[pvp] [${this.bot.user.username}] join war zone queue`)

			this.bot.properties.isOnWarZoneQueue = true

			this.bot.network.send("PVPQr", [ 'doomarena' ])
		}
	}

	onSpawn(): void {
		this.bot.joinMapRandom()
	}

	onTargetDeath(avatar: Avatar): void {
		this.bot.joinMapRandom()
	}

	onUserMoveToCell(username: string, frame: string):void {
		if (frame == 'r1') {
			const networkId: number = this.bot.room.getPlayerByUsername(username)!.id
			this.attack(networkId)
			this.bot.properties.intervalAttack = setInterval(() => this.attack(networkId), 2000)
		}
	}

	private attack(networkId: number): void {
		this.bot.network.send('gar', [1, `${['aa', 'a1', 'a2', 'a3', 'a4'][Helper.randomIntegerInRange(0, 4)]}>p:${networkId}`, "wvz"])
	}

}