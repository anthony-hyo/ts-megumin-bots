import Dictionary from "./Dictionary";
import logger from "../utility/Logger"
import Config from "../utility/Config";
import {ISeeborg} from "../interfaces/IConfig";
import MainMulti from "../MainMulti";
import Helper from "../utility/Helper";

const stringUtil = require('../utility/stringutil');
const _ = require('underscore');

export default class Seeborg {

	protected readonly dictionary: Dictionary = new Dictionary()

	protected readonly seeborg: ISeeborg

	public readonly callback!: Function

	constructor(config:Config, seeborg: ISeeborg, fileName: string) {
		this.seeborg = seeborg

		this.dictionary.init(fileName)

		setInterval(() => {
			logger.warn(`[Seeborg] Saving dictionary...`);

			this.dictionary.save();

			logger.warn(`[Seeborg] Dictionary saved.`);

		}, config.autoSavePeriod() * 1000);
	}

	public onMessage(...args: string[]): void {
	}

	protected computeAnswer(message: string): string | undefined {
		const words: string[] = stringUtil.splitWords(message)
		const knownWords: string[] = words.filter((word: string) => this.dictionary.isWordKnown(word))

		if (knownWords.length === 0) {
			logger.debug(`[Seeborg] no sentences with ${words} found`)
			return undefined
		}

		const pivot: any = _.sample(knownWords);
		const sentences: (string | undefined)[] = this.dictionary.sentencesWithWord(pivot);

		switch (sentences.length) {
			case 0:
				return undefined
			case 1:
				return sentences[0]
		}

		const leftSentence = _.sample(sentences);
		const rightSentence = _.sample(sentences);

		const leftSentenceWords: string[] = stringUtil.splitWords(leftSentence);
		const rightSentenceWords: string[] = stringUtil.splitWords(rightSentence);

		const leftSide: string[] = leftSentenceWords.slice(0, leftSentenceWords.indexOf(pivot));
		const rightSide: string[] = rightSentenceWords.slice(rightSentenceWords.indexOf(pivot) + 1, rightSentenceWords.length);

		return [leftSide.join(' '), pivot, rightSide.join(' ')].join(' ');
	}

	protected shouldComputeAnswer(channel: string, isMentioned: boolean, message: string): boolean {
		if (!MainMulti.singleton.config.speaking(this.seeborg, channel)) {
			return false;
		} else if (Helper.chancePredicate(MainMulti.singleton.config.replyMention(this.seeborg, channel), () => isMentioned)) {
			return true;
		} else if (Helper.chancePredicate(MainMulti.singleton.config.replyMagic(this.seeborg, channel), () => MainMulti.singleton.config.matchesMagicPattern(this.seeborg, channel, message))) {
			return true;
		} else if (Helper.chancePredicate(MainMulti.singleton.config.replyRate(this.seeborg, channel), () => true)) {
			return true
		}

		return false;
	}

	protected learn(message: string): void {
		try {
			this.dictionary.insertLine(message);
		} catch (error) {
			logger.error(`[Seeborg] learn ${error}`)
		}
	}

	protected shouldLearn = (channel: string, message: string): boolean => !MainMulti.singleton.config.learning(this.seeborg, channel) ? false : !MainMulti.singleton.config.matchesBlacklistedPattern(this.seeborg, channel, message);

	protected shouldProcessMessage = (channel: string, userKey: string): boolean => !MainMulti.singleton.config.isIgnored(this.seeborg, channel, userKey);

}