const es = require('./es.js');
const en = require('./en.js');

/**
 * @fileOverview Definition for Languages class
 * @module languages
 */

/**
 * @classdesc Class for multi-language support
 *
 * @constructor
 */
class Languages {
	constructor() {
		this.locale = {
			es,
			en,
		};

		this.monthActions = Array(12)
			.fill()
			.map((x, i) => `month ${i}`);

		this.dayActions = [];

		for (let i = 0; i <= 12; i++) {
			for (let h = 1; h <= 31; h++) {
				this.dayActions.push(`day ${h} ${i}`);
			}
		}
	}

	/**
	 * Return locale object of defined language
	 *
	 * @param {string} languageCode - language code
	 * @example
	 * getLocale('en');
	 */
	getLocale(languageCode) {
		if (languageCode) {
			if (languageCode in this.locale) {
				return this.locale[languageCode];
			}
		}
		return this.locale.en;
	}

	/**
	 * Return bot commands
	 */
	getCommands() {
		const commands = {};

		Object.values(this.locale).forEach(({ COMMANDS }) => {
			Object.keys(COMMANDS).forEach((key) => {
				if (key in commands) {
					commands[key].push(COMMANDS[key]);
				} else {
					commands[key] = [COMMANDS[key]];
				}
			});
		});
		return commands;
	}

	/**
	 * Return bot actions
	 */
	getActions() {
		return {
			monthActions: this.monthActions,
			dayActions: this.dayActions,
		};
	}
}

module.exports = {
	Languages,
};
