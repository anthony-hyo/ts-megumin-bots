import Default from "./Default";
import Helper from "../../utility/Helper";
import IMoveToArea, {Monmap} from "../../interface/request/IMoveToArea";

export default class WorldBoss extends Default {

	onJoin(data: IMoveToArea): void {
		const arr: Array<string> = [
			'newbie',
			'outset',
			'yulgar',
			'avalon',
			'estarta',
			'ivillis',
		]

		if (data.strMapName == 'town' && Boolean(Helper.randomIntegerInRange(0, 1))) {
			this.bot.network.send('cmd', ['tfer', '', arr[Helper.randomIntegerInRange(0, arr.length - 1)]])
			return
		}

		if (this.bot.properties.intervalAttack != null) {
			clearInterval(this.bot.properties.intervalAttack)
		}

		if (this.bot.properties.intervalWalk != null) {
			clearInterval(this.bot.properties.intervalWalk)
		}

		if (data.monmap !== undefined && data.monmap.length > 0) {
			const monster: Monmap = data.monmap[Helper.randomIntegerInRange(0, data.monmap.length - 1)]

			setTimeout(() => {
				this.bot.network.send('moveToCell', [
					monster.strFrame,
					'Left'
				])

				this.bot.properties.intervalAttack = setInterval(() => {
					this.bot.network.send('gar', [1, `aa>m:${monster.MonMapID}`, "wvz"])
					this.bot.network.send('gar', [1, `a1>m:${monster.MonMapID}`, "wvz"])
				}, 5000)
			}, 3000)
		} else {
			this.bot.properties.intervalWalk = setInterval(() => {
				this.bot.room.freeWalk()
			}, 60000 * 5)
		}
	}

	onWorldBoss(data: any) {
		this.bot.network.send('joinWorldBoss', [data.worldBossId])
	}

}