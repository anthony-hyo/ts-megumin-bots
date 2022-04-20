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
			logger.debug('[Seeborg] Saving dictionary...');

			this.dictionary.save();

			logger.debug('[Seeborg] Dictionary saved.');

		}, config.autoSavePeriod() * 1000);
	}

	public onMessage(bot: Bot, channel: string, username: string, message: string) {
		try {
			if (this.shouldProcessMessage(username, username)) { //Reply?
				if (this.shouldComputeAnswer(channel, username, message)) {
					setTimeout(() => this.replyWithAnswer(bot, channel, message), Math.floor((Math.floor(Math.random() * 3) + 1) * 1000))
				}
				if (this.shouldLearn(channel, message)) {
					this.learn(message);
				}
			}
		} catch (error) {
			logger.error(`[Seeborg] Seeborg error ${error}`)
		}
	}

	private replyWithAnswer(bot: Bot, channel: string, message: string) {
		logger.debug('[Seeborg] Reply with answer');

		message = this.computeAnswer(message);

		switch (message) {
			case null:
				logger.error('[Seeborg] response was null');
				break;
			default:
				message = message.replace('@', '')
				logger.info(`[Seeborg] Reply "${bot.room.name}" "${channel}" ${message}"`)
				bot.network.send('message', [message, channel])
				break;
		}
	}

	private computeAnswer(message: string) {
		const words = stringUtil.splitWords(message);
		const knownWords = words.filter((word: any) => this.dictionary.isWordKnown(word));

		if (knownWords.length === 0) {
			logger.debug(`[Seeborg] No sentences with ${words} found`);
			return null;
		}

		const pivot = _.sample(knownWords);
		const sentences = this.dictionary.sentencesWithWord(pivot);

		switch (sentences.length) {
			case 0:
				return null;
			case 1:
				return sentences[0];
		}

		const leftSentence = _.sample(sentences);
		const rightSentence = _.sample(sentences);

		const leftSentenceWords = stringUtil.splitWords(leftSentence);
		const rightSentenceWords = stringUtil.splitWords(rightSentence);

		const leftSide = leftSentenceWords.slice(0, leftSentenceWords.indexOf(pivot));
		const rightSide = rightSentenceWords.slice(rightSentenceWords.indexOf(pivot) + 1, rightSentenceWords.length);

		return [leftSide.join(' '), pivot, rightSide.join(' ')].join(' ');
	}

	private shouldComputeAnswer(channel: string, username: string, message: string) {
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

	private learn(message: string) {
		logger.debug(`[Seeborg] Learn`);

		try {
			this.dictionary.insertLine(message);
		} catch (error) {
			logger.error(`[Seeborg] Learn ${error}`)
		}
	}

	private shouldLearn(channel: string, message: string) {
		if (!this.config.learning(channel)) {
			return false;
		}

		// Ignore messages that match the blacklist
		if (this.config.matchesBlacklistedPattern(channel, message)) {
			logger.debug(`[Seeborg] Should learn is black listed ${message}`);
			return false;
		}

		return true;
	}

	private shouldProcessMessage(channel: string, username: string) {
		//Ignore users in the ignore list
		if (this.config.isIgnored(channel, username)) {
			logger.debug(`[Seeborg] Should process message ignored "${channel}" "${username}"`);
			return false;
		}

		return true;
	}

}