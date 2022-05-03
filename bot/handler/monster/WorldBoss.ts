import Monster from "./Monster";
import IMoveToArea from "../../../interface/request/IMoveToArea";

export default class WorldBoss extends Monster {

	onJoin(data: IMoveToArea) {
		if (this.bot.properties.isOnWorldBoss) {
			this.bot.properties.isOnWorldBoss = false
			this.bot.joinMapRandom()
		}

		super.onJoin(data);
	}

	onWorldBoss(data: any) {
		this.bot.network.send('joinWorldBoss', [data.worldBossId])
	}

}