import IConfig from "../interface/IConfig";
import {IConfigDatabase} from "../interface/IConfigDatabase";

const yaml = require('yaml-js')

const fs = require('fs')

export default class Config {

    private readonly dict: IConfig

    constructor(obj: IConfig) {
        this.dict = obj
    }

    public get database(): IConfigDatabase {
        return this.dict.database
    }

    public static loadConfig(filename: string) {
        return new Config(yaml.load(fs.readFileSync(filename)))
    }

}
