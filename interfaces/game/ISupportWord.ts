export interface IWord {
    key: Array<string | RegExp>
    message: Array<string>
}

export interface ISupportWord {
    words: Array<IWord>
}
