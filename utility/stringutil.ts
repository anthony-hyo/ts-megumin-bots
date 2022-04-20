const RE_SPLIT_WORDS = /\s+|[,.!?:]+(\s|$)+/m;
const RE_SPLIT_SENTENCES = /(?<=[.!?])(\s+)/m;

function splitWords(str: string) {
	return removeEmpty(str.split(RE_SPLIT_WORDS));
}

function splitSentences(str: string) {
	return removeEmpty(str.split(RE_SPLIT_SENTENCES));
}

function removeEmpty(strArr: any[]) {
	return strArr.filter(el =>
		el !== null && el !== undefined && el.trim() !== '');
}

module.exports = {
	splitWords: splitWords,
	splitSentences: splitSentences
};