const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const moment = require('moment');

/**
 * @fileOverview This is the definition of the bot functions class
 * @module events
 */

/**
 * @classdesc Container class for bot functions
 *
 * @constructor
 * @param {Object} cumplebot - Reference to CumpleBot class
 */
class Events {
	constructor(cumplebot) {
		this.cumplebot = cumplebot;
	}

	/**
	 * Setting bot commands
	 */
	start() {
		const { languages } = this.cumplebot;

		return async (ctx) => {
			const { language_code: lanCode = 'en' } = ctx.from;
			const lan = languages.getLocale(lanCode);

			const commands = [
				{
					command: `/${lan.COMMANDS.ADDME}`,
					description: lan.DESCRIPTIONS.ADDME,
				},
				{
					command: `/${lan.COMMANDS.CHANNEL}`,
					description: lan.DESCRIPTIONS.CHANNEL,
				},
			];
			await ctx.setMyCommands(commands);
			return ctx.reply('Ok');
		};
	}

	/**
	 * Show bot commands to users
	 */
	help() {
		const { languages } = this.cumplebot;

		return async (ctx) => {
			const { language_code: lanCode = 'en' } = ctx.from;
			const lan = languages.getLocale(lanCode);

			const commands = await ctx.getMyCommands();
			const info = commands.reduce(
				(acc, val) => `${acc}/${val.command} - ${val.description}\n`,
				''
			);
			return ctx.reply(`${lan.DESCRIPTION}\n\n${info}`);
		};
	}

	/**
	 * Invoke all chat members registered in cumplebot
	 */
	callChannel() {
		const {
			bot,
			model: {
				models: { User },
			},
		} = this.cumplebot;

		return async (ctx) => {
			if (!ctx) return;
			const {
				chat: { id: chatId },
				from: { id: fromId },
			} = ctx.update.message;

			const users = await User.find({ chatId });
			let message = '';

			users.forEach(({ userId, username }) => {
				if (fromId !== userId) message += `@${username} `;
			});

			bot.telegram.sendMessage(chatId, message);
		};
	}

	/**
	 * Show inline keyboard for birthday month selection
	 */
	getMonth() {
		const {
			functions: { capitalize },
			languages,
		} = this.cumplebot;

		return (ctx) => {
			const { language_code: lanCode = 'en' } = ctx.from;
			const lan = languages.getLocale(lanCode);
			const buttons = [];

			for (let i = 0; i < 12; i++) {
				const monthShort = moment()
					.month(i)
					.locale(lanCode)
					.format('MMM');

				const button = Markup.callbackButton(
					capitalize(monthShort),
					`month ${i}`
				);
				buttons.push(button);
			}

			const keyboard = Markup.inlineKeyboard(buttons, {
				columns: 3,
			});

			ctx.reply(lan.SELECT_MONTH, Extra.markup(keyboard));
		};
	}

	/**
	 * Show inline keyboard for birthday day selection
	 */
	getDay() {
		const { languages } = this.cumplebot;

		return (ctx) => {
			const { language_code: lanCode = 'en' } = ctx.from;
			const lan = languages.getLocale(lanCode);

			const month = ctx.match.split(' ')[1];
			const monthName = moment()
				.month(month)
				.locale(lanCode)
				.format('MMMM');
			const days = moment()
				.month(month)
				.year(2020)
				.endOf('month')
				.format('DD');
			const buttons = [];

			for (let i = 1; i <= 35; i++) {
				let button = Markup.callbackButton(i, `day ${i} ${month}`);
				if (i > days) button = Markup.callbackButton(' ', '_');
				buttons.push(button);
			}

			const keyboard = Markup.inlineKeyboard(buttons, {
				columns: 7,
			});

			ctx.answerCbQuery(`${monthName}`);
			ctx.deleteMessage();
			ctx.reply(lan.SELECT_DAY, Extra.markup(keyboard));
		};
	}

	/**
	 * Catch month and day selected and send for save
	 */
	storeDate() {
		return (ctx) => {
			const [day, month] = ctx.match
				.split(' ')
				.slice(1, 3)
				.map((i) => parseInt(i, 10));

			ctx.answerCbQuery(`${day}`);
			ctx.deleteMessage();
			this.saveBirthday(ctx, { day, month: 1 + month });
		};
	}

	/**
	 * Save/update birthday in DB
	 */
	async saveBirthday(ctx, date) {
		const {
			functions: { formatString },
			languages,
			model: {
				models: { User },
			},
		} = this.cumplebot;

		const { language_code: lanCode = 'en' } = ctx.from;
		const lan = languages.getLocale(lanCode);
		const {
			message: {
				chat: { id: chatId },
			},
			from: {
				id: userId,
				username,
				first_name: firstName,
				last_name: lastName,
			},
		} = ctx.update.callback_query;

		let userDoc = await User.findOne({ userId, chatId });

		if (userDoc) {
			userDoc.birthday = date;
		} else {
			userDoc = new User({
				userId,
				chatId,
				username,
				firstName,
				lastName,
				lan: ctx.from.language_code,
				birthday: date,
			});
		}

		userDoc
			.save()
			.then(() => {
				const successMesage = formatString(
					lan.SUCCESSFULL,
					`@${username}`
				);
				ctx.reply(successMesage);
			})
			.catch((err) => {
				console.log(`caught the error: ${err}`);
				ctx.reply(lan.ERROR);
			});
	}

	/**
	 * Send birthday message to user
	 */
	birthdayMessage() {
		const {
			bot,
			functions: { formatString },
			languages,
			model: {
				models: { User },
			},
		} = this.cumplebot;

		return async () => {
			const users = await User.find();

			users.forEach(
				({ chatId, birthday, lan: language, username, firstName }) => {
					const lan = languages.getLocale(language);
					const message = formatString(
						lan.HAPPY_BIRTHDAY,
						`@${username}`,
						firstName
					);

					const { day, month } = birthday;
					const currentMonth = parseInt(moment().format('M'), 10);
					const currentDay = parseInt(moment().format('D'), 10);

					if (day === currentDay && month === currentMonth) {
						bot.telegram.sendMessage(chatId, message);
					}
				}
			);
		};
	}
}

module.exports = {
	Events,
};
