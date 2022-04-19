import Config from "./utility/Config"
import Database from "./database/Database"
import Request from "./request/Request";
import User from "./database/model/User";
import Bot from "./bot/Bot";
import {Op, Sequelize} from "sequelize";

export default class Main {

    private readonly config: Config = Config.loadConfig('./config.yml')

    private readonly database: Database = new Database(this.config)

    public readonly bots: Map<Number, Bot> = new Map<Number, Bot>()

    constructor() {
        Main._singleton = this

        this.bots.clear()

        //this.startBot(1)

        User.findAll({
            // where: {
            //     username: {[Op.in]: ['Acid Bunny', 'Agapi Mou', 'Alliebear', 'Ancestor', 'Angel Baby', 'Andre the Giant', 'Amore Mio', 'Ankle Biter', 'Armrest', 'Ashkim', 'Baba Ganoush', 'Baby Angel', 'Beer Belly', 'Babett']}
            // },
            limit: 50,
            order: Sequelize.literal('random()')
        }).then((users: User[]) => users.forEach(user => this.startBot(user.id)))

        // User.findAll().then((users: User[]) => {
        //     let i = 0
        //     for (const user of users) {
        //         if (i > 5) break
        //         new Bot(user.id)
        //         i++
        //     }
        // })

    }

    private static _singleton: Main

    public static get singleton(): Main {
        return this._singleton;
    }

    private _request: Request = new Request();

    public get request(): Request {
        return this._request;
    }

    public startBot(botId: number): Bot {
        const bot = new Bot(botId)
        this.bots.set(botId, bot)
        return bot
    }

}

new Main();