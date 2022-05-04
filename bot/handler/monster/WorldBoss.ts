import Monster from "./Monster";

export default class WorldBoss extends Monster {

	onWorldBoss(data: any) {
		this.bot.network.send('joinWorldBoss', [data.worldBossId])
	}

}