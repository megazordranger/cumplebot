/**
 * @fileOverview Global functions container class
 * @module functions
 */

/**
 * @classdesc Container class for global functions
 *
 * @constructor
 */
class GlobalFunctions {
	/**
	 * Capitalize string
	 *
	 * @param {string} s - string for capitalize
	 */
	static capitalize(s) {
		if (typeof s !== 'string') return '';
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	/**
	 * Concatenate using .net style format strings
	 *
	 * @param {string} format A string format like "Hello {0}, now take off your {1}!"
	 * @param {...?} args One argument per `{}` in the string, positionally replaced
	 * @returns {string}
	 */
	static formatString(format, ...args) {
		let str = format;
		for (let i = 0; i < args.length; i++) {
			const reg = new RegExp(`\\{${i}\\}`, 'gm');
			str = str.replace(reg, args[i]);
		}
		return str;
	}
}

module.exports = { GlobalFunctions };
