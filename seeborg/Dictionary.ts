import {ISeeborgDictionary} from "../interfaces/ISeeborgDictionary";

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

	private dictionary!: ISeeborgDictionary

	private filename: string = 'dictionary.json'

	public init(filename: string) {
		this.filename = filename

		if (!fs.existsSync(this.filename)) {
			fs.writeFileSync(this.filename, '{"sentences":[],"mappings":{}}');
		}

		let data: string = fs.readFileSync(this.filename, 'utf8');

		this.dictionary = JSON.parse(data);
	}

	public save(): void {
		fs.writeFileSync(this.filename, JSON.stringify(this.dictionary), {
			encoding: 'utf8',
			flag: 'w+'
		});
	}

	public insertLine(message: string): void {
		for (const sentence of splitSentences(message)) {
			this.insertSentence(sentence);
		}
	}

	public isWordKnown = (word: string) => this.wordIndexList(word) !== null;

	public sentencesWithWord(word: any): (string | undefined)[] {
		const indexList: number[] | null = this.wordIndexList(word);
		return indexList === null ? [] : indexList.map((index: number) => this.dictionary.sentences.at(index));
	}

	private insertSentence(sentence: string): void {
		if (!this.hasSentence(sentence)) {
			this.dictionary.sentences.push(sentence);
			for (let word of splitWords(sentence)) {
				this.insertWord(word, this.dictionary.sentences.length - 1);
			}
		}
	}

	private insertWord(word: string, sentenceIndex: number): void {
		const wordIndexList: number[] | null = this.wordIndexList(word);

		if (wordIndexList === null) {
			this.dictionary.mappings[word] = [sentenceIndex]
		} else if (!wordIndexList.includes(sentenceIndex)) {
			wordIndexList.push(sentenceIndex);
		}
	}

	private hasSentence: (sentence: string) => boolean = (sentence: string) => this.dictionary.sentences.includes(sentence);

	private wordIndexList(word: string): null | number[] {
		const indexList: number[] = this.dictionary.mappings[word];
		return indexList === null || indexList === undefined ? null : indexList;
	}

}