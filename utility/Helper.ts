import * as fs from "fs"
import {Collection, Guild as GuildDiscord, Invite as InviteDiscord, User as UserDiscord} from "discord.js"
import DiscordInvite from "../database/model/DiscordInvite";
import DiscordGuild from "../database/model/DiscordGuild";
import DiscordUser from "../database/model/DiscordUser";
import logger from "./Logger";
import {IFormatMessage} from "../interfaces/discord/IFormatMessage";

const Request = require('Request')

const moment = require('moment')

const GifFrames = require('gif-frames')
const Animated = require('animated-gif-detector')

export default class Helper {

	public static async gifToPNG(gif: string, path: string) {
		return new Promise((res, rej) => {
			let w = fs.createWriteStream(path)

			Request(gif).pipe(w)

			w.on('finish', () => {
				if (Animated(fs.readFileSync(path))) {
					GifFrames({ url: gif, frames: 0 }).then((gifFinal: any) => {
						let x = fs.createWriteStream(path)
						gifFinal[0].getImage().pipe(x)
						return x.on('finish', res)
					})
				} else {
					res(true)
				}
			})
		})
	}

	public static isEqual(value: any, other: any): boolean {
		const type = Object.prototype.toString.call(value)
		if (type !== Object.prototype.toString.call(other)) return false
		if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false
		const valueLen = type === "[object Array]" ? value.length : Object.keys(value).length
		const otherLen = type === "[object Array]" ? other.length : Object.keys(other).length
		if (valueLen !== otherLen) return false
		const compare = (item1: any, item2: any) => {
			const itemType = Object.prototype.toString.call(item1)
			if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
				if (!Helper.isEqual(item1, item2)) return false
			} else {
				if (itemType !== Object.prototype.toString.call(item2)) return false
				if (itemType === "[object Function]") {
					if (item1.toString() !== item2.toString()) return false
				} else if (item1 !== item2) return false
			}
		}
		if (type === "[object Array]") {
			for (let i = 0; i < valueLen; i++) {
				if (!compare(value[i], other[i])) return false
			}
		} else {
			for (let key in value) {
				if (Object.prototype.hasOwnProperty.call(value, key)) {
					if (!compare(value[key], other[key])) return false
				}
			}
		}
		return true
	}

	public static async formatMessage(message: string, formatMessage: IFormatMessage): Promise<string> {
		moment.locale('en')

		if (formatMessage.user !== undefined) {
			message = message.replace(/{user}/g, formatMessage.user.toString())
			message = message.replace(/{user.name}/g, formatMessage.user.username)
			message = message.replace(/{user.tag}/g, formatMessage.user.tag)
			message = message.replace(/{user.createdAt}/g, moment(formatMessage.user.createdAt, "YYYYMMDD").fromNow())
			message = message.replace(/{user.id}/g, formatMessage.user.id)
		}

		if (formatMessage.guild !== undefined) {
			message = message.replace(/{guild}/g, formatMessage.guild.name)
			message = message.replace(/{guild.count}/g, String(formatMessage.guild.memberCount))
		}

		if (formatMessage.guild !== undefined) {
			message = message.replace(/{server}/g, formatMessage.guild.name)
			message = message.replace(/{server.count}/g, formatMessage.guild.name)
		}

		if (formatMessage.inviter !== undefined) {
			message = message.replace(/{inviter}/g, formatMessage.inviter.toString())
			message = message.replace(/{inviter.tag}/g, formatMessage.inviter.tag)
			message = message.replace(/{inviter.name}/g, formatMessage.inviter.username)
			message = message.replace(/{inviter.id}/g, formatMessage.inviter.id)
			//message = message.replace(/{inviter.invites}/g, String(inviterData.regular + inviterData.bonus - inviterData.fake - inviterData.leaves))
		}

		if (formatMessage.invite !== undefined) {
			message = message.replace(/{invite.code}/g, formatMessage.invite.code)
			message = message.replace(/{invite.uses}/g, String(formatMessage.invite.uses))
			message = message.replace(/{invite.url}/g, `https://discord.gg/${formatMessage.invite.code}`)
			//message = message.replace(/{invite.channel}/g, formatMessage.invite.channel.toString)
			//message = message.replace(/{invite.channel.name}/g, formatMessage.invite.channel.name)
		}

		if (formatMessage.channelId !== undefined) {
			message = message.replace(/{invite.channel}/g, `<#${formatMessage.channelId}>`)
			//message = message.replace(/{invite.channel.name}/g, formatMessage.channel.na)
		}

		return message
	}

	public static numberEnding = (number: number): "s" | "" => number > 1 ? 's' : '';

	public static millisecondsToStr(milliseconds: number): string {
		let temp = Math.floor(milliseconds / 1000)

		let years = Math.floor(temp / 31536000)
		if (years) {
			return years + ' year' + this.numberEnding(years)
		}

		//TODO: Months! Maybe weeks?

		let days = Math.floor((temp %= 31536000) / 86400)
		if (days) {
			return days + ' day' + this.numberEnding(days)
		}

		let hours = Math.floor((temp %= 86400) / 3600)
		if (hours) {
			return hours + ' hour' + this.numberEnding(hours)
		}

		let minutes = Math.floor((temp %= 3600) / 60)
		if (minutes) {
			return minutes + ' minute' + this.numberEnding(minutes)
		}

		let seconds = temp % 60
		if (seconds) {
			return seconds + ' second' + this.numberEnding(seconds)
		}

		return 'less than a second' //'just now' //or other string you like
	}

	public static async fetchUser(userObj: { userId: string; user: UserDiscord | undefined }): Promise<DiscordUser> {
		logger.debug(`[fetchUser] fetch user ${userObj.user?.username}(${userObj.userId})`)

		let [user]: [DiscordUser, boolean] = await DiscordUser.findCreateFind({
			where: {
				userId: userObj.userId,
			}
		}).catch(logger.error)

		if (userObj.user !== undefined) {
			user.username = userObj.user.username
			user.discriminator = userObj.user.discriminator
			user.isBot = userObj.user.bot
			user.avatar = userObj.user.avatar
			user.createdAt = userObj.user.createdAt

			user.save()
				.catch(error => logger.error(`User ${userObj.user?.username} findCreateFind Save error ${error}`))
		}

		return user
	}

	public static async fetchGuild(guildDiscord: GuildDiscord): Promise<DiscordGuild> {
		logger.debug(`[fetchGuild] fetch guild ${guildDiscord.name}(${guildDiscord.id})`)

		let [guild]: [DiscordGuild, boolean] = await DiscordGuild.findCreateFind({
			where: {
				guildId: guildDiscord.id,
			}
		}).catch(logger.error)

		await Helper.fetchUser({
			userId: guildDiscord.ownerId,
			user: (await guildDiscord.fetchOwner()).user
		})
			.catch(error => logger.error(`fetchGuild ${error}`))

		guild.shardId = guildDiscord.shardId
		guild.ownerId = guildDiscord.ownerId
		guild.name = guildDiscord.name
		guild.description = guildDiscord.description ? guildDiscord.description : ``

		guild.save()
			.catch(error => logger.error(`Guild ${guildDiscord.name} findCreateFind Save error ${error}`))

		return guild
	}

	public static async fetchInviteAll(guildDiscord: GuildDiscord): Promise<Array<DiscordInvite>> {
		logger.debug(`[fetchInvite] fetch guild ${guildDiscord.name}(${guildDiscord.id}) invites`)

		let invites: Array<DiscordInvite> = new Array<DiscordInvite>()

		if (guildDiscord.me !== null && guildDiscord.me.permissions.has("MANAGE_GUILD")) {
			guildDiscord.invites.fetch()
				.then((guildInvites: Collection<string, InviteDiscord>) => {
					guildInvites.forEach(async guildInvite => {
						invites.push(await Helper.fetchInvite(guildInvite))
					})
				}).catch(error => logger.error(`Guild invites ${error}`));
		}

		return invites
	}

	public static async fetchInvite(inviteDiscord: InviteDiscord): Promise<DiscordInvite> {
		let inviterId: string | null = inviteDiscord.inviter ? inviteDiscord.inviter.id : null

		if (inviterId !== null && inviteDiscord.inviter !== null) {
			await Helper.fetchUser({
				userId: inviterId,
				user: inviteDiscord.inviter
			})
		}

		let [invite]: [DiscordInvite, boolean] = await DiscordInvite.findCreateFind({
			where: {
				code: inviteDiscord.code,
				inviterId: inviteDiscord.inviter ? inviteDiscord.inviter.id : null,
				guildId: inviteDiscord.guild ? inviteDiscord.guild.id : null
			}
		}).catch(error => logger.error(`findCreateFind ${inviteDiscord.code} ${inviteDiscord.inviter?.username} (${inviteDiscord.inviter?.id}) error ${error}`))

		invite.channelId = inviteDiscord.channel.id ? inviteDiscord.channel.id : null
		invite.isDeletable = inviteDiscord.deletable
		invite.createdAt = inviteDiscord.createdAt
		invite.expiresAt = inviteDiscord.expiresAt
		invite.inviterId = inviterId
		invite.maxAge = inviteDiscord.maxAge
		invite.maxUses = inviteDiscord.maxUses
		invite.isTemporary = inviteDiscord.temporary ? inviteDiscord.temporary : false
		invite.uses = inviteDiscord.uses

		invite.save()
			.catch(error => logger.error(`Invite ${inviteDiscord.code} findCreateFind Save error ${error}`))

		return invite
	}

	public static getAllFilesFromFolder(dir: string): string[] {
		let results: string[] = []

		fs.readdirSync(dir).forEach((file: string) => {
			file = dir + '/' + file

			let stat = fs.statSync(file)

			if (stat && stat.isDirectory()) {
				results = results.concat(Helper.getAllFilesFromFolder(file))
			} else {
				results.push(file)
			}

		})

		return results;
	}

	public static async asyncForEach(array: Array<any>, callback: Function): Promise<void> {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array)
		}
	}

	public static randomIntegerInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

	public static arrayAverage(arr: Array<number>): number {
		//Find the sum
		let sum = 0;

		for (const i in arr) {
			sum += arr[i];
		}
		//Get the length of the array
		const numbersCnt = arr.length;

		//Return the average / mean.
		return sum / numbersCnt
	}

	public static parseHTML = (value: string) => value.replace(/(<([^>]+)>)/ig, '');

	public static chancePredicate = (chancePercentage: number, predicate: { (): any; (): any; (): boolean; (): any; }) => !!(chancePercentage > 0 && predicate() && (chancePercentage > Math.random() * 99 || chancePercentage === 100));

	public static replaceLastDigit(value: number): number {
		const l: number = value.toString().length - 1
		return Math.floor(value  / l) * l
	}

	public static increaseByPercentage(percent: number, value: number): number {
		return value + this.calculatePercent(percent, value)
	}

	public static decreaseByPercentage(percent: number, value: number): number {
		return value - this.calculatePercent(percent, value)
	}

	private static calculatePercent(percent: number, value: number){
		return (percent / 100) * value
	}

	public static shuffle(array: Array<any>): Array<any> {
		let currentIndex: number = array.length,  randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex != 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [ array[randomIndex], array[currentIndex] ];
		}

		return array;
	}

}
