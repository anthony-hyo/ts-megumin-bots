import * as net from "net";
import logger from "../utility/Logger";
import Bot from "../bot/Bot";
import {INetworkSend} from "../interface/INetworkSend";
import Main from "../Main";

export default class Network {

    private readonly socket: net.Socket = new net.Socket()

    private readonly bot: Bot = null

    private readonly delimiter = '\0';

    constructor(bot: Bot, port: number, ip: string) {
        this.bot = bot

        this.socket.connect(port, ip);

        this.socket.setEncoding('utf-8');

        this.listeners()
    }

    private _id = -1

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public send(command: string, args: Array<any>) {
        logger.debug(`[send] ${command} ${args.toString()}`)

        this.write({
            type: 'request',
            body: {
                cmd: command,
                args: args
            }
        });
    }

    public event(command: string, args: Array<any>) {
        logger.debug(`[event] ${command} ${args.toString()}`)

        this.write({
            type: 'event',
            body: {
                cmd: command,
                args: args
            }
        });
    }

    public write(iNetworkSend: INetworkSend) {
        this.socket.write(`${JSON.stringify(iNetworkSend)}\0`)
    }

    private listeners() {
        this.socket.on('connect', () => {
            logger.debug('connected to server')

            this.event('login', [
                this.bot.user.username,
                this.bot.properties.token
            ])
        })

        let chunk = "";

        this.socket.on('data', (data: any) => {
            chunk += data.toString();

            let d_index = chunk.indexOf(this.delimiter);

            while (d_index > -1) {
                try {
                    const string = chunk.substring(0, d_index);

                    logger.debug(`[received] ${string}`)

                    Main.singleton.request.run(string, this.bot)
                } catch (error) {
                    logger.error(`error when receiving ${error}`)
                }

                chunk = chunk.substring(d_index + this.delimiter.length)
                d_index = chunk.indexOf(this.delimiter)
            }
        })

        this.socket.on('error', () => {
            logger.warn('close')
        })

        this.socket.on('close', () => {
            logger.warn('close')
        })

        this.socket.on('end', () => {
            logger.warn('end')
        })
    }

}