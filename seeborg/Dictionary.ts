const fs = require('fs');

const stringUtil = require('../utility/stringutil');
const splitWords = stringUtil.splitWords;
const splitSentences = stringUtil.splitSentences;

/**
 * @typedef {Object} Dictionary
 * @property {Array<String>} sentences
 * @property {Array<Object>} mappings
 */

export default class Dictionary {

    private readonly dictionary: any;

    private readonly filename = 'dictionary.json';

    constructor() {
        if (!fs.existsSync(this.filename)) {
            fs.writeFileSync(this.filename, '{"sentences":[],"mappings":{}}');
        }

        let data = fs.readFileSync(this.filename, 'utf8');

        this.dictionary = JSON.parse(data);
    }

    public save() {
        fs.writeFileSync(this.filename, JSON.stringify(this.dictionary), {
            encoding: 'utf8',
            flag: 'w+'
        });
    }

    public insertLine(line: any) {
        for (let sentence of splitSentences(line)) {
            this.insertSentence(sentence);
        }
    }

    public isWordKnown(word: any) {
        return this.wordIndexList(word) !== null;
    }

    public sentencesWithWord(word: any) {
        let indexList = this.wordIndexList(word);
        return indexList === null ? [] : indexList.map((index: string | number) => this.dictionary.sentences[index]);
    }

    private insertSentence(sentence: any) {
        if (!this.hasSentence(sentence)) {
            this.dictionary.sentences.push(sentence);
            for (let word of splitWords(sentence)) {
                this.insertWord(word, this.dictionary.sentences.length - 1);
            }
        }
    }

    private insertWord(word: string | number, sentenceIndex: number) {
        let wordIndexList = this.wordIndexList(word);
        if (wordIndexList === null) {
            this.dictionary.mappings[word] = [sentenceIndex]
        } else if (!wordIndexList.includes(sentenceIndex)) {
            wordIndexList.push(sentenceIndex);
        }
    }

    private hasSentence(sentence: any) {
        return this.dictionary.sentences.includes(sentence);
    }

    private wordIndexList(word: string | number) {
        let indexList = this.dictionary.mappings[word];
        return indexList === null || indexList === undefined ? null : indexList;
    }

}