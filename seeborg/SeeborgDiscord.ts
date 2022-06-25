import {Message} from "discord.js";
import logger from "../utility/Logger"
import Seeborg from "./Seeborg";
import MainMulti from "../MainMulti";

export default class SeeborgDiscord extends Seeborg {

    public onMessage(...args: any[]): void {
        const message: Message = args[0]

        try {
            if (this.shouldProcessMessage(message.channel.id, message.author.id)) {
                if (this.shouldComputeAnswer(message.channel.id, message.mentions.users.find(value => value.id === MainMulti.singleton.megumin.client.user?.id) != undefined, message.cleanContent)) {
                    message.channel
                        .sendTyping()
                        .then(() => setTimeout(() => {
                            const reply: string | undefined = this.computeAnswer(message.content);

                            if (reply === undefined || reply == message.content) {
                                logger.error(`[Seeborg] replyWithAnswer response was undefined or invalid`);
                                return
                            }

                            message.channel
                                .send(reply.replace(/<@.?\d*?>/, ''))
                                .catch(error => logger.error(`[Seeborg] replyWithAnswer ${error}`))
                        }, Math.floor((Math.floor(Math.random() * 3) + 1) * 1000)))
                        .catch(error => logger.error(`[Seeborg] sendTyping error ${error}`))
                }
                if (this.shouldLearn(message.channel.id, message.cleanContent)) {
                    this.learn(message.content);
                }
            }
        } catch (error) {
            logger.error(`[Seeborg] onMessage ${error}`)
        }
    }

}