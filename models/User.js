const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
	{
		displayName: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
		},
		username: {
			type: String,
			required: [true, "Please enter your username"],
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please enter your password"],
			trim: true,
			minlength: [6, "Password should be at least 6 characters."],
			maxlength: [12, "Password can be at max 12 characters."],
		},
		displayPic: {
			type: String,
			default: "https://bit.ly/2Z9iVhk",
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
			},
		],
		followingCount: {
			type: Number,
			default: 0,
		},
		followerCount: {
			type: Number,
			default: 0,
		},
		postCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: { currentTime: () => Date.now() } }
);

let User = new mongoose.model("User", userSchema);

module.exports = {
	User,
};
