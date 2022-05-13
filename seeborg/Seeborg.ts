import Dictionary from "./Dictionary";
import logger from "../utility/Logger"
import Helper from "../utility/Helper";
import Bot from "../bot/Bot";
import Config from "../utility/Config";

const stringUtil = require('../utility/stringutil');
const _ = require('underscore');

export default class Seeborg {

	private readonly dictionary: Dictionary = new Dictionary()

	private readonly config: Config

	constructor(config: Config) {
		this.config = config

		setInterval(() => {
			logger.debug(`[seeborg] Saving dictionary...`);

			this.dictionary.save();

			logger.debug(`[seeborg] Dictionary saved.`);

		}, config.autoSavePeriod() * 1000);
	}

	public onMessage(bot: Bot, channel: string, username: string, message: string): void {
		try {
			if (this.shouldProcessMessage(username, username)) { //Reply?
				if (this.shouldComputeAnswer(channel, bot.user.username, message)) {
					setTimeout(() => this.replyWithAnswer(bot, channel, message), Math.floor((Math.floor(Math.random() * 15) + 1) * 1000))
				}
				if (this.shouldLearn(channel, message)) {
					this.learn(message);
				}
			}
		} catch (error) {
			logger.error(`[seeborg] [${bot.user.username}] error ${error}`)
		}
	}

	private replyWithAnswer(bot: Bot, channel: string, message: string): void {
		logger.debug(`[seeborg] [${bot.user.username}] reply with answer`);

		let reply: string | null = this.computeAnswer(message);

		if (reply == message) {
			reply = null
		}

		switch (reply) {
			case null:
				logger.error(`[seeborg] [${bot.user.username}] response was null`);
				break;
			default:
				logger.debug(`[seeborg] [${bot.user.username}] reply ${channel} > ${reply}`)
				bot.network.send('message', [reply, channel])
				break;
		}
	}

	private computeAnswer(message: string): string | null {
		const words: string[] = stringUtil.splitWords(message);
		const knownWords: string[] = words.filter((word: string) => this.dictionary.isWordKnown(word));

		if (knownWords.length === 0) {
			logger.debug(`[seeborg] no sentences with ${words} found`);
			return null;
		}

		const pivot: any = _.sample(knownWords);
		const sentences = this.dictionary.sentencesWithWord(pivot);

		switch (sentences.length) {
			case 0:
				return null;
			case 1:
				return sentences[0];
		}

		const leftSentence = _.sample(sentences);
		const rightSentence = _.sample(sentences);

		const leftSentenceWords: string[] = stringUtil.splitWords(leftSentence);
		const rightSentenceWords: string[] = stringUtil.splitWords(rightSentence);

		const leftSide: string[] = leftSentenceWords.slice(0, leftSentenceWords.indexOf(pivot));
		const rightSide: string[] = rightSentenceWords.slice(rightSentenceWords.indexOf(pivot) + 1, rightSentenceWords.length);

		return [leftSide.join(' '), pivot, rightSide.join(' ')].join(' ');
	}

	private shouldComputeAnswer(channel: string, username: string, message: string): boolean {
		if (!this.config.speaking(channel)) { // Bot should not speak if speaking is set to false
			return false;
		} else if (Helper.chancePredicate(this.config.replyMention(channel), () => message.includes(username))) {// Reply mention //TODO: CHECK Whisper
			return true;
		}else if (Helper.chancePredicate(this.config.replyMagic(channel), () => this.config.matchesMagicPattern(channel, message))) { // Reply magic
			return true;
		} else if (Helper.chancePredicate(this.config.replyRate(channel), () => true)) { // Reply rate
			return true
		} else {
			return false;
		}
	}

	private learn(message: string): void {
		logger.debug(`[seeborg] learn`);

		try {
			this.dictionary.insertLine(message);
		} catch (error) {
			logger.error(`[seeborg] learn ${error}`)
		}
	}

	private shouldLearn(channel: string, message: string): boolean {
		if (!this.config.learning(channel)) {
			return false;
		}

		// Ignore messages that match the blacklist
		if (this.config.matchesBlacklistedPattern(channel, message)) {
			logger.debug(`[seeborg] should learn is black listed ${message}`);
			return false;
		}

		return true;
	}

	private shouldProcessMessage(channel: string, username: string): boolean {
		//Ignore users in the ignore list
		if (this.config.isIgnored(channel, username)) {
			logger.debug(`[seeborg] should process message ignored ${channel} > ${username}`);
			return false;
		}

		return true;
	}

}