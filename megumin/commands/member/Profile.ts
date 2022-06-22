import {GuildMember, Message} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";
import axios, {AxiosResponse} from "axios";
import * as Fs from "fs";
import Helper from "../../../utility/Helper";
import Jimp = require("jimp");

export default class Profile extends DefaultCommand {

	public readonly name: string = `profile`
	public readonly description: string = `player profile`
	public readonly helper: string = `(username)`
	public readonly cooldown: number = 15

	public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
		const name: string = args.list().join(" ")

		if (!/^[A-Za-z][A-Za-z0-9\s]*(?:_[A-Za-z0-9]+)*$/.exec(name)) {
			message
				.reply("Wrong username format.")
				.catch(error => logger.error(`Message send error ${error}`))
			return
		}

		let url: string;

		switch (guild.guildId) {
			case "325896240145367040":
				url = "redhero.online";
				break;
			case "806658757081301053":
				url = "redaq.net";
				break;
			default:
				message
					.reply("not available.")
					.catch(error => logger.error(`Message send error ${error}`))
				return
		}

		axios
			.get(`https://${url}/api/user/data/${name}/F53831D23FC8D97E1CE1283234D2B`)
			.then((response: AxiosResponse) => {
				const user: any = response.data;

				if (user.unique === undefined) {
					message
						.reply("Something wrong, fix it!!")
						.catch(error => logger.error(`Message send error ${error}`))
					return
				}

				const path: string = `./assets/images/cache/${guild.guildId}/${user.data.id}/`

				const file: string = path + user.unique + '.png'

				if (Fs.existsSync(file)) {
					message.channel.send({
						files: [file]
					})
					return
				}

				if (!Fs.existsSync(path)) {
					Fs.mkdirSync(path)
				}

				Helper.gifToPNG(`https://${url}/api/image/user/cover/${user.data.id}`, `${path}cover.png`)
					.then(() =>
						Helper.gifToPNG(`https://${url}/api/image/user/avatar/${user.data.id}/${user.data.ProviderID}`, `${path}avatar.png`)
							.then(() =>
								Helper.gifToPNG(`https://${url}/api/image/render/character/${user.data.id}?${user.unique}`, `${path}character.png`)
									.then(() => {
											const cover: any = Jimp.read(path + 'cover.png')
											const avatar: any = Jimp.read(path + 'avatar.png')
											const character: any = Jimp.read(path + 'character.png')

											const text: any = Jimp.loadFont('assets/fonts/candara.fnt')

											const model: any = Jimp.read('assets/images/model.png')
											const background: any = Jimp.read('assets/images/background.png')

											Promise.all([background, cover, model, text, avatar, character])
												.then(data => {
													const cover = data[1]
													const avatar = data[4]
													const character = data[5]

													const text = data[3]

													const model = data[2]
													const background = data[0]

													cover.resize(786, Jimp.AUTO)
													cover.crop(0, 0, 786, 290)

													character.flip(true, false)

													avatar.resize(Jimp.AUTO, 151)

													model.print(text, 15, 280, user.data.Username)
													//model.print(text, 658, 125.5, `${user.data.Level}`)

													background.composite(cover, 7, 8)
													background.composite(model, 0, 0)
													background.composite(character, -50, -17)
													background.composite(avatar, 70, 64)

													background.write(file, () =>
														message.channel.send({
															files: [file]
														})
													)
												})
												.catch(error => logger.error(`gifToPNG error ${error}`))

										}
									)
									.catch(error => logger.error(`gifToPNG error ${error}`))
							)
							.catch(error => logger.error(`gifToPNG error ${error}`))
					)
					.catch(error => logger.error(`gifToPNG error ${error}`))
			})
			.catch((response: any) => logger.error(`[Profile] error "${response}"`))
	}

}
