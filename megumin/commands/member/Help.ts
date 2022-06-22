import {EmbedFieldData, GuildMember, Message, MessageEmbed} from "discord.js";
import DefaultCommand from "../../DefaultCommand";
import Megumin from "../../Megumin";
import logger from "../../../utility/Logger";
import DiscordGuild from "../../../database/model/DiscordGuild";
import CommandArg from "../../../utility/CommandArg";

export default class Help extends DefaultCommand {

    public readonly name: string = `help`
    public readonly description: string = `show text entered as the bot`
    public readonly helper: string = `(message)`

    public handler(megumin: Megumin, message: Message, member: GuildMember, guild: DiscordGuild, args: CommandArg): void {
        const field: Array<EmbedFieldData> = new Array<EmbedFieldData>()

        Megumin.commands.forEach((command) => {
            if (!command.isAdminOnly) {
                field.push({
                    name: `${guild.prefix}${command.name} ${command.helper}`,
                    value: command.description
                })
            }
        })

        const embed: MessageEmbed = new MessageEmbed()
            .setColor('#f00000')
            .setTitle('Bot commands')
            //.setURL('https://salsicha.club/')
            //.setAuthor('SDS', 'https://i.imgur.com/lsYvXMT.png', 'https://salsicha.club/')
            .setDescription('Bot commands')
            //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .addFields(field)
            //.addField('Inline field title', 'Some value here', true)
            //.setImage('https://i.imgur.com/wSTFkRM.png')
            .setTimestamp()
            .setFooter('Rem', 'https://i.imgur.com/lsYvXMT.png')

        message.channel
            .send({
                embeds: [
                    embed
                ]
            })
            .catch(error => logger.error(`Message send error ${error}`))
    }

}