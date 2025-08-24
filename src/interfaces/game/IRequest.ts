import Bot from "../../bot/Bot";

export default interface IRequest {

	command: string

	handler(bot: Bot, data: any): void

}