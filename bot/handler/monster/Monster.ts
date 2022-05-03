import Default from "../Default";
import Helper from "../../../utility/Helper";
import IMoveToArea, {Monmap} from "../../../interface/request/IMoveToArea";
import {AvatarState} from "../../../request/packets/CombatState";

export default class Monster extends Default {

	onJoin(data: IMoveToArea): void {
		if (this.bot.properties.intervalAttack != null) {
			clearInterval(this.bot.properties.intervalAttack)
		}

		if (this.bot.properties.intervalWalk != null) {
			clearInterval(this.bot.properties.intervalWalk)
		}

		if (data.monmap !== undefined && data.monmap.length > 0) {
			for (const value of data.mondef) {
				if (value.isWorldBoss) {
					const mon = data.monBranch.filter(value2 =>  value2.MonID === value.MonID)[0]

					// join new map random if monster state dead
					if (mon.intState == AvatarState.DEAD) {
						this.bot.joinMapRandom()
						return
					}

					this.bot.properties.isOnWorldBoss = true
				}
			}

			const monster: Monmap = data.monmap[Helper.randomIntegerInRange(0, data.monmap.length - 1)]

			setTimeout(() => {
				this.bot.network.send('moveToCell', [
					monster.strFrame,
					'Left'
				])

				this.bot.properties.intervalAttack = setInterval(() => {
					this.bot.network.send('gar', [1, `aa>m:${monster.MonMapID}`, "wvz"])
					this.bot.network.send('gar', [1, `a1>m:${monster.MonMapID}`, "wvz"])
					this.bot.network.send('gar', [1, `a2>m:${monster.MonMapID}`, "wvz"])
					this.bot.network.send('gar', [1, `a3>m:${monster.MonMapID}`, "wvz"])
					this.bot.network.send('gar', [1, `a4>m:${monster.MonMapID}`, "wvz"])
				}, 2000)
			}, 3000)
		} else {
			this.bot.properties.intervalWalk = setInterval(() => {
				this.bot.room.freeWalk()
			}, 60000 * 5)
		}
	}

}