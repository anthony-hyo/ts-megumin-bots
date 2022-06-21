import Fill from "./Fill";
import {ISupportWord, IWord} from "../../interface/ISupportWord";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";
import {IItem} from "../../interface/IItem";
import logger from "../../utility/Logger";

export default class SupportRedHero extends Fill {

    protected readonly map: string = 'town-1'

    protected static question1: RegExp = /\?|wher|wehre|onde|any|get|how/

    protected readonly key: ISupportWord = {
        words: [
            {
                key: [
                    /enh|enhan|enahn|anhan|encanta/,
                    SupportRedHero.question1
                ],
                message: [
                    `You can farm basic Enhancement at /join trainers`
                ]
            },
            {
                key: [
                    /coin|cion|coisn|hc|ac|moeda/,
                    SupportRedHero.question1
                ],
                message: [
                    `You can farm Hero Coins in /join Farm, World Bosses and Trading`
                ]
            },
            {
                key: [
                    /level|lvl|levl|lvel|upa/,
                    SupportRedHero.question1
                ],
                message: [
                    `Level Up in /join getxp, /join fanworld, /join thravine (deadchewer QUEST) and /join training`
                ]
            },
            {
                key: [
                    /redeem|code|codig/,
                    SupportRedHero.question1
                ],
                message: [
                    `Join redhero.online/discord for redeem codes and more`,
                    `to claim the Redeem code click Features > Redeem COde near to skills`,
                ]
            },
            {
                key: [
                    /staff|mod|adm|artist|add/,
                    /\?|wher|wehre|onde|any|apply|ser|viro|how/
                ],
                message: [
                    `Join redhero.online/discord and check the channel #recruitement to apply as staff`
                ]
            },
            {
                key: [
                    /chun|chum/,
                    SupportRedHero.question1
                ],
                message: [
                    `You can farm Chunchunmaru at /join trainers, accept and complete the quest`,
                    `or you can either buy them if you have Hero Coins at Cleric Joy shop located in the Game Menu.`
                ]
            },
            {
                key: [
                    /soul|blood/,
                    SupportRedHero.question1
                ],
                message: [
                    `You can farm Boss Blood and Boss Souls at the World Bosses or trading/market.`
                ]
            },
            {
                key: [
                    'boost',
                    SupportRedHero.question1
                ],
                message: [
                    `You can get Boost (XP, Coin, Rep and Cp) in /join blackhorn by killing Resless Undead monster.`,
                    `or /join training and complete the quest Training Support.`
                ]
            }
        ]
    }

    onInventoryLoad(data: ILoadInventoryBig): void {
        data.items.forEach((item: IItem) => this.bot.inventory.all.set(item.ItemID, item))

        this.bot.joinMap(this.map)
    }

    onUserMessage(channel: string, username: string, message: string) {
        const word: IWord | undefined = this.key.words.find(value => {
            const checkIncludes: Array<boolean> = []

            value.key.forEach((reqWord: string | RegExp) => {
                if (reqWord instanceof RegExp) {
                    if (reqWord.test(message.toLowerCase())) {
                        checkIncludes.push(true)
                    }
                } else if (message.toLowerCase().includes(reqWord)) {
                    checkIncludes.push(true)
                }
            });

            return checkIncludes.length === value.key.length
        })

        if (word !== undefined) {
            logger.info(`[Support] (${this.bot.user.server}) ${this.bot.user.username} reply "${username} (${channel}): ${message}" with "${word.message}"`)
            word.message.forEach((message: string) => this.bot.sendMessage(channel, message))
        }
    }

}