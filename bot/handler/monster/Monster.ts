import Default from "../Default";

export default class Monster extends Default {

	onJoin(): void {
		if (this.bot.room.data.monmap !== undefined && this.bot.room.data.monmap.length > 0) {
			this.bot.joinMapRandom()
			return
		}

		if (this.bot.properties.wasOnWorldBoss) {
			this.bot.properties.wasOnWorldBoss = false
			this.bot.joinMapRandom()
		}

		this.bot.attackRandomTarget()
	}

	onSpawn(): void {
		this.bot.attackRandomTarget()
	}

}