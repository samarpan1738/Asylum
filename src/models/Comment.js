const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
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
		likesCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: { currentTime: () => Date.now() } }
);

let Comment = new mongoose.model("Comment", commentSchema);

module.exports = {
	Comment,
};
