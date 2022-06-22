const RE_SPLIT_WORDS = /\s+|[,.!?:]+(\s|$)+/m;
const RE_SPLIT_SENTENCES = /(?<=[.!?])(\s+)/m;

const splitWords = (str: string): string[] => removeEmpty(str.split(RE_SPLIT_WORDS));

const splitSentences = (str: string): string[] => removeEmpty(str.split(RE_SPLIT_SENTENCES));

const removeEmpty = (strArr: string[]): string[] => strArr.filter((str: string) => str !== null && str !== undefined && str.trim() !== '');

module.exports = {
	splitWords: splitWords,
	splitSentences: splitSentences
};