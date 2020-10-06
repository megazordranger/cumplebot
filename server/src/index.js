require('custom-env').env();
const Telegraf = require('telegraf');
const schedule = require('node-schedule');

/**
 * @fileOverview This is the definition of the main class for bot function
 * @module cumplebot
 * @requires model
 * @requires languages
 * @requires functions
 * @requires events
 */

const { Model } = require('./models');
const { Languages } = require('./locale');
const { GlobalFunctions } = require('./functions');
const { Events } = require('./events');

/**
 * @classdesc Main class for bot initialization and lanch
 *
 * @constructor
 */
class CumpleBot {
	constructor() {
		this.bot = new Telegraf(process.env.BOT_TOKEN);
		this.model = new Model();
		this.functions = GlobalFunctions;
		this.languages = new Languages();
		this.events = new Events(this);

		//* Set execution rule for node-schedule */
		this.rule = new schedule.RecurrenceRule();
		this.rule.hour = process.env.RULE_HOUR;
	}

	/**
	 * Initialize bot, schedule execution and launch
	 */
	startBot() {
		const { ADDME, CHANNEL, HELP } = this.languages.getCommands();
		const { monthActions, dayActions } = this.languages.getActions();
		const { bot } = this;

		//* Set node-schedule execution */
		schedule.scheduleJob(this.rule.hour, this.events.birthdayMessage());

		//* Set bot commands/actions and launching */
		bot.start(this.events.start());
		bot.command(HELP, this.events.help());
		bot.command(CHANNEL, this.events.callChannel());
		bot.command(ADDME, this.events.getMonth());
		bot.action(monthActions, this.events.getDay());
		bot.action(dayActions, this.events.storeDate());
		bot.launch();
	}
}

module.exports = {
	CumpleBot,
};
