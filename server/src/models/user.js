const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema(
	{
		userId: {
			type: Number,
			required: true,
			trim: true,
			maxlength: 150,
		},
		chatId: {
			type: Number,
			required: true,
			trim: true,
			maxlength: 150,
		},
		username: {
			type: String,
			required: true,
			trim: true,
			maxlength: 150,
		},
		firstName: {
			type: String,
			required: true,
			trim: true,
			maxlength: 150,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
			maxlength: 150,
		},
		birthday: {
			day: {
				type: Number,
				required: true,
				trim: true,
			},
			month: {
				type: Number,
				required: true,
				trim: true,
			},
		},
		lan: {
			type: String,
			required: true,
			trim: true,
			maxlength: 2,
		},
	},
	{
		timestamps: true,
		writeConcern: {
			w: 1,
			j: true,
		},
	}
);

module.exports = mongoose.model('User', userSchema);
