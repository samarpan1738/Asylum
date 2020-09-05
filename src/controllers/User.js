const { User } = require("../models/User");

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
				select: "content likeCount dislikeCount commentCount _id",
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
		res.status(200).json({ success: true, data: user });
	} catch (err) {
		next(err);
	}
}

async function follow(req, res, next) {
	// if of the user to follow
	let { id } = req.params;
	let my_id = req.user._id;

	const user = User.findById(id);
	// * Case-1 : User does not exist
	if (!user) {
		res.status(404);
		return next({ success: false, message: "User does not exist" });
	}
	// * Case-2 : Both are the same users - Inception
	if (id == my_id) {
		res.status(400);
		return next({ success: false, message: "You can't follow yourself" });
	}
	// * Case-3 : Already following
	if (req.user.followers.includes(my_id)) {
		res.status(400);
		return next({ success: false, message: "Already following" });
	}
	// * Now we can follow safely
	await User.findByIdAndUpdate(my_id, {
		$push: { following: id },
		$inc: { followingCount: 1 },
	});
	await User.findByIdAndUpdate(id, {
		$push: { followers: my_id },
		$inc: { followersCount: 1 },
	});
	res.status(200).json({ success: true, data: false });
}

async function unfollow(req, res, next) {
	// if of the user to follow
	let { id } = req.params;
	let my_id = req.user._id;

	const user = User.findById(id);
	// * Case-1 : User does not exist
	if (!user) {
		res.status(404);
		return next({ success: false, message: "User does not exist" });
	}
	// * Case-2 : Both are the same users - Inception
	if (id == my_id) {
		res.status(400);
		return next({ success: false, message: "You can't unfollow yourself" });
	}
	// * Case-3 : Already unfollowed
	if (!req.user.followers.includes(my_id)) {
		res.status(400);
		return next({
			success: false,
			message: "You need to follow first to unfollow",
		});
	}
	// * Now we can unfollow safely
	await User.findByIdAndUpdate(my_id, {
		$pull: { following: id },
		$inc: { followingCount: -1 },
	});
	await User.findByIdAndUpdate(id, {
		$pull: { followers: my_id },
		$inc: { followersCount: -1 },
	});

	res.status(200).json({ success: true, data: false });
}

module.exports = {
	getUsers,
	getUser,
	follow,
	unfollow,
};
