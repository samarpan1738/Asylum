const { User } = require("../models/User");
const mongoose = require("mongoose");

async function getUsers(req, res, next) {
	try {
		const users = await User.find().select("-password").lean().exec();
		res.status(200).json({ success: true, data: users });
	} catch (err) {
		next(err);
	}
}
// Get a user with a particular username
async function getUser(req, res, next) {
	try {
		const { username } = req.params;
		const user = await User.findOne({ username })
			.select("-password")
			.populate({
				path: "posts",
				select:
					"content likeCount dislikeCount commentCount _id createdAt author",
				populate: { path: "author", select: "username displayName displayPic" },
			})
			.populate({
				path: "followers",
				select: "displayName username displayPic _id",
			})
			.populate({
				path: "following",
				select: "displayName username displayPic _id",
			})
			.lean()
			.exec();
		if (!user) {
			res.status(404);
			return next({ success: false, message: "User does not exist" });
		}
		// console.log(user);

		user.isFollowing = false;
		// * Check who all in the user's follower list is the current user following
		user.followers.forEach((follower) => {
			follower.isFollowing = false;
			if (req.user.following.includes(follower._id.toString())) {
				follower.isFollowing = true;
			}
		});

		// * Check who all in the user's following list is the current user following
		user.following.forEach((user) => {
			user.isFollowing = false;
			if (req.user.following.includes(user._id.toString())) {
				user.isFollowing = true;
			}
		});
		// * Check is current user is following this user
		const followers = user.followers.map((follower) => follower._id.toString());

		if (followers.includes(req.user._id.toString())) {
			user.isFollowing = true;
		}
		//  * Check if this user is the current logged in user
		// if (req.user._id === user._id) user.isMe = true;
		user.isMe = req.user._id.toString() === user._id.toString();

		res.status(200).render("user", { user: user });
		// res.status(200).json({ success: true, data: user });
	} catch (err) {
		next(err);
	}
}

async function follow(req, res, next) {
	// if of the user to follow
	let { username } = req.params;
	let my_username = req.user.username;

	const user = await User.findOne({ username });
	// * Case-1 : User does not exist
	if (!user) {
		res.status(404);
		return next({ success: false, message: "User does not exist" });
	}
	// * Case-2 : Both are the same users - Inception
	if (username == my_username) {
		res.status(400);
		return next({ success: false, message: "You can't follow yourself" });
	}
	// * Case-3 : Already following
	if (req.user.following.includes(user._id)) {
		res.status(400);
		return next({ success: false, message: "Already following" });
	}
	// * Now we can follow safely
	await User.findByIdAndUpdate(req.user._id, {
		$push: { following: mongoose.Types.ObjectId(user._id) },
		$inc: { followingCount: 1 },
	});

	// console.log(user);
	let up = await User.findByIdAndUpdate(user._id, {
		$push: { followers: req.user._id },
		$inc: { followerCount: 1 },
	});
	res.status(200).json({ success: true, data: false });
}

async function unfollow(req, res, next) {
	// if of the user to follow
	let { username } = req.params;
	let my_username = req.user.username;

	const user = await User.findOne({ username });
	// * Case-1 : User does not exist
	if (!user) {
		res.status(404);
		return next({ success: false, message: "User does not exist" });
	}
	// * Case-2 : Both are the same users - Inception
	if (username == my_username) {
		res.status(400);
		return next({ success: false, message: "You can't unfollow yourself" });
	}
	// * Case-3 : Already unfollowed
	if (!req.user.following.includes(user._id)) {
		res.status(400);
		return next({
			success: false,
			message: "You need to follow first to unfollow",
		});
	}
	// * Now we can unfollow safely
	await User.updateOne(
		{ username: my_username },
		{
			$pull: { following: user._id },
			$inc: { followingCount: -1 },
		}
	);
	await User.updateOne(
		{ username },
		{
			$pull: { followers: req.user._id },
			$inc: { followerCount: -1 },
		}
	);

	res.status(200).json({ success: true, data: false });
}

module.exports = {
	getUsers,
	getUser,
	follow,
	unfollow,
};
