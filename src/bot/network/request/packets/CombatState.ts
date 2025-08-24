import Bot from "../../../Bot";
import IRequest from "../../../../interfaces/game/IRequest";
import Avatar from "../../../data/Avatar";

const AvatarType = {
	PLAYER: 'p',
	MONSTER: 'm',
	NPC: 'n'
}

export const AvatarState = {
	DEAD: 0,
	NEUTRAL: 1,
	COMBAT: 2
}

export default class CombatState implements IRequest {

	public command: string = 'ct'

	private bot!: Bot;

	handler(bot: Bot, data: any): void {
		this.bot = bot

		// Player
		if (data.p != undefined) {
			this.parse(AvatarType.PLAYER, data.p)
		}

		// Monster
		if (data.m != undefined) {
			this.parse(AvatarType.MONSTER, data.m)
		}

		// NPC
		if (data.n != undefined) {
			this.parse(AvatarType.NPC, data.n)
		}
	}

	private parse(avatarType: string, data: any) {
		for (const pKey in data) {
			const element: any = data[pKey]

			if (element.intState !== undefined) {
				let avatar: Avatar | null = this.bot.room.getPlayerByUsername(pKey);

				switch (avatarType) {
					case AvatarType.PLAYER:
						avatar = this.bot.room.getPlayerByUsername(pKey);
						break
					case AvatarType.MONSTER:
						avatar = this.bot.room.getMonsterByMonsterMapId(Number(pKey));
						break
					case AvatarType.NPC:
						avatar = this.bot.room.getNpcByNpcMapId(Number(pKey));
						break
				}

				if (avatar) {
					switch (element.intState) {
						case AvatarState.DEAD:
							if (avatar.username.toLocaleLowerCase() == this.bot.user.username.toLocaleLowerCase()) {
								this.bot.handler.onDeath()
							} else {
								this.bot.handler.onTargetDeath(avatar)
							}
							break;
						case AvatarState.NEUTRAL:
							break
						case AvatarState.COMBAT:
							break
					}
				}
			}
		}
	}

}