import logger from "./Logger";

export default class CommandArg {

    public length: number
    private readonly args: Array<string> = new Array<string>()

    public static parse(params: string[]): CommandArg {
        let arg: CommandArg = new CommandArg()

        params.forEach((param: string) => {
            if (!isNaN(parseInt(param))) {
                arg.add(parseInt(param))
            } else {
                arg.add(param)
            }
        })

        arg.length = arg.list().length

        return arg
    }

    public getInt(argIndex: number): number {
        return parseInt(this.args[argIndex].valueOf())
    }

    public getStr(argIndex: number): string {
        return this.args[argIndex].valueOf()
    }

    public list(): Array<string> {
        return this.args
    }

    public toString(): string {
        return this.list().toString()
    }

    private add(argObj: any): void {
        this.args.push(argObj.toString())
    }

}
