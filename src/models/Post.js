const mongoose = require("mongoose");

let postSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		content: {
			type: String,
			maxlength: [500, "Max limit is 500 characters"],
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		likesCount: {
			type: Number,
			default: 0,
		},
		commentsCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: { currentTime: () => Date.now() } }
);

let Post = new mongoose.model("Post", postSchema);

module.exports = {
	Post,
};
