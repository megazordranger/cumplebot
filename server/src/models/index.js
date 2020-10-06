const mongoose = require('mongoose');

/**
 * @fileOverview Definition for Model class
 * @module model
 * @requires User
 */

const User = require('./user');

/**
 * @classdesc Class for DB Model
 *
 * @constructor
 */
class Model {
	constructor() {
		this.dbURI = process.env.DB_HOST;
		this.dbName = process.env.DB_NAME;

		this.modelList = {
			User,
		};

		this.initDB();
	}

	/**
	 * Initialize DB connection
	 */
	initDB() {
		const { dbURI, dbName } = this;

		mongoose.connect(dbURI, {
			useNewUrlParser: true,
			dbName,
			autoIndex: false,
			useUnifiedTopology: true,
		});

		//* Connection events */
		mongoose.connection.on('connected', () => {
			console.log(`Mongoose connected to ${dbURI}`);
		});
		mongoose.connection.on('error', (err) => {
			console.log(`Mongoose connection error: ${err}`);
		});
		mongoose.connection.on('disconnected', () => {
			console.log('Mongoose disconnected');
		});

		//* Capture app termination/restart events */
		const gracefulShutdown = (msg, callback) => {
			mongoose.connection.close(() => {
				console.log(`Mongoose disconnected through ${msg}`);
				callback();
			});
		};
		//* For nodemon restarts */
		process.once('SIGUSR2', () => {
			gracefulShutdown('nodemon restart', () => {
				process.kill(process.pid, 'SIGUSR2');
			});
		});
		//* For app termination */
		process.on('SIGINT', () => {
			gracefulShutdown('app termination', () => {
				process.exit(0);
			});
		});
	}

	/**
	 * Return DB models
	 *
	 * @returns {Object[]}
	 */
	get models() {
		return this.modelList;
	}
}

module.exports = {
	Model,
};
