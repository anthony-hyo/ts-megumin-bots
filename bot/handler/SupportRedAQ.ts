import {ISupportWord} from "../../interface/ISupportWord";
import SupportRedHero from "./SupportRedHero";

export default class SupportRedAQ extends SupportRedHero {

    protected readonly key: ISupportWord = {
        words: [
            {
                key: [
                    /enh|enhan|enahn|anhan|encanta/,
                    SupportRedHero.question1
                ],
                message: [
                    `You can farm basic Enhancement at /join trainingport`
                ]
            },
            {
                key: [
                    /coin|cion|coisn|hc|ac|moeda/,
                    SupportRedHero.question1
                ],
                message: [
                    `You can farm Red Coins in /join Coin, World Bosses and Trading`
                ]
            },
            {
                key: [
                    /level|lvl|levl|lvel|upa/,
                    SupportRedHero.question1
                ],
                message: [
                    `Level Up in /join forestnewbie (lvl 1), /join UP (lvl 50), /join UP2 (lvl 150) and /join UP3 (lvl 250)`
                ]
            },
            {
                key: [
                    /redeem|code|codig/,
                    SupportRedHero.question1
                ],
                message: [
                    `Join redaq.net/discord for redeem codes and more`,
                    `to claim the Redeem code click Features > Redeem COde near to skills`,
                ]
            },
            {
                key: [
                    /staff|mod|adm|artist|add/,
                    /\?|wher|wehre|onde|any|apply|ser|viro|how/
                ],
                message: [
                    `Join redaq.net/discord and check the channel #recruitement to apply as staff`
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
                    `You can buy Boost (XP, Coin, Rep and Cp) in /join guide and for the requirements is at the /join forestnewbie.`
                ]
            }
        ]
    }

}