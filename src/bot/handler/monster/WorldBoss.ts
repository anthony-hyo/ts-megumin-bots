import Monster from "./Monster";

export default class WorldBoss extends Monster {

	onWorldBoss(data: any): void {
		this.bot.network.send('joinWorldBoss', [data.worldBossId])
	}

}