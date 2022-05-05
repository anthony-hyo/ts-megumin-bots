import Default from "../Default";
import Helper from "../../../utility/Helper";
import {IMonMap} from "../../../interface/request/IMoveToArea";
import {AvatarState} from "../../../request/packets/CombatState";
import logger from "../../../utility/Logger";

export default class Monster extends Default {

	onJoin(): void {
		if (this.bot.properties.wasOnWorldBoss) {
			this.bot.properties.wasOnWorldBoss = false
			this.bot.joinMapRandom()
		}

		this.attack()
	}

	onSpawn(): void {
		logger.debug('default onSpawn')

		this.attack()
	}

	private attack(): void {
		if (this.bot.room.data.monmap !== undefined && this.bot.room.data.monmap.length > 0) {
			for (const value of this.bot.room.data.mondef) {
				if (value.isWorldBoss) {
					const mon = this.bot.room.data.monBranch.filter(value2 => value2.MonID === value.MonID)[0]

					// join new map random if monster state dead
					if (mon.intState == AvatarState.DEAD) {
						this.bot.joinMapRandom()
						return
					}

					this.bot.properties.wasOnWorldBoss = true
				}
			}

			const monster: IMonMap = this.bot.room.data.monmap[Helper.randomIntegerInRange(0, this.bot.room.data.monmap.length - 1)]

			setTimeout(() => {
				this.bot.room.moveToCell(monster.strFrame, 'Left')

				this.bot.properties.intervalAttack = setInterval(() => {
					if (this.bot.room.frame === monster.strFrame) {
						this.bot.network.send('gar', [1, `${['aa', 'a1', 'a2', 'a3', 'a4'][Helper.randomIntegerInRange(0, 4)]}>m:${monster.MonMapID}`, "wvz"])
					}
				}, 2000)
			}, 3000)
		} else {
			this.bot.joinMapRandom()
		}
	}

}