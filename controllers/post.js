const { Post } = require("../models/Post");
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

const mongoose = require("mongoose");

async function getPosts(req, res, next) {
	try {
		let posts = await Post.find({})
			.sort({ createdAt: -1 })
			.populate({
				path: "author",
				select: "username displayPic displayName _id",
			})
			.populate({
				path: "likes",
				select: "username displayPic displayName _id",
			})
			.populate({
				path: "dislikes",
				select: "username displayPic displayName _id",
			})
			.populate({
				path: "comments",
				select: "-post",
				populate: {
					path: "author",
					select: "username displayPic displayName _id",
				},
				populate: {
					path: "likes",
					select: "username displayPic displayName _id",
				},
				populate: {
					path: "dislikes",
					select: "username displayPic displayName _id",
				},
			})
			.lean()
			.exec();
		//  * We need to check which posts are liked/disliked by current user
		// if (req.user) {
		posts = posts.map((post) => {
			post.isLiked = false;
			post.isDisliked = false;
			const likes = post.likes.map((like) => like._id.toString());
			post.isLiked = likes.includes(req.user._id.toString());
			const dislikes = post.dislikes.map((dislike) => dislike._id.toString());
			post.isDisliked = dislikes.includes(req.user._id.toString());
			return post;
		});
		// }
		// return { success: true, data: posts };
		res.status(200).render("explore", {
			loggedInUser: req.user,
			posts: posts,
			user: req.user,
		});
		// res.status(200).json({ success: true, data: posts });
	} catch (err) {
		next(err);
		// return { success: false, err };
	}
}

async function getPostsOfFollowing(req, res, next) {
	let user = req.user;
	let posts = await Post.find({})
		.sort({ createdAt: -1 })
		.populate({
			path: "author",
			select: "username displayPic displayName _id",
		})
		.populate({
			path: "likes",
			select: "username displayPic displayName _id",
		})
		.lean()
		.exec();
	posts = posts.filter((post) => {
		return user.following.includes(post.author._id.toString());
	});
	posts = posts.map((post) => {
		post.isLiked = false;
		post.isDisliked = false;
		const likes = post.likes.map((like) => like._id.toString());
		post.isLiked = likes.includes(req.user._id.toString());
		const dislikes = post.dislikes.map((dislike) => dislike._id.toString());
		post.isDisliked = dislikes.includes(req.user._id.toString());
		return post;
	});
	// console.log(posts);
	res.status(200).render("homepage", { loggedInUser: req.user, user, posts });
}

async function getPost(req, res, next) {
	try {
		let post = await Post.findById(req.params.id)
			.populate({
				path: "author",
				select: "username displayPic displayName _id",
			})
			.populate({
				path: "likes",
				select: "username displayPic displayName _id",
			})
			.populate({
				path: "dislikes",
				select: "username displayPic displayName _id",
			})
			// TODO: Find Bugfix for--> 2 level deep population
			.populate({
				path: "comments",
				populate: {
					path: "author",
					select: "username displayPic displayName _id ",
				},
				populate: {
					path: "likes",
					select: "username displayPic displayName _id",
				},
				populate: {
					path: "post",
					select: "_id",
				},
			})
			.lean()
			.exec();

		if (!post) {
			res.status(404);
			return next({ message: "Post not found" });
		}
		//  * We need to check some more things like whether this post is liked/disliked by current user
		// if (req.user) {
		const likes = post.likes.map((like) => like._id.toString());
		post.isLiked = likes.includes(req.user._id.toString());
		console.log(likes);
		// const dislikes = post.dislikes.map((dislike) => dislike._id.toString());
		// post.isDisliked = dislikes.includes(req.user._id.toString());

		// console.log("*****************POST************");
		// console.log(post);
		// console.log(post.comments);
		//  * and is a comment on this post liked or disliked my current user
		// const comments = post.comments.map((comment) => {
		// 	comment.isLiked = false;
		// 	comment.isDisliked = false;
		// 	if (comment.likes.author._id.toString() == req.user._id.toString())
		// 		comment.isLiked = true;
		// 	if (comment.dislikes.author._id.toString() == req.user._id.toString())
		// 		comment.isDisliked = true;
		// 	return comment;
		// });
		// post.comments = comments;
		//  * and does this post belong to me
		post.isMine = req.user._id.toString() == post.author._id.toString();
		// }

		res
			.status(200)
			.render("post", { loggedInUser: req.user, user: req.user, post: post });
		// res.status(200).json({ success: true, data: post });
	} catch (err) {
		next(err);
	}
}

async function addPost(req, res, next) {
	try {
		const { content } = req.body;
		// create post
		let post = await Post.create({
			author: mongoose.Types.ObjectId(req.user._id),
			content,
		});
		// Add it to user's post array
		// console.log("Current user id ", req.user._id);
		await User.findByIdAndUpdate(req.user._id, {
			$push: { posts: post._id },
			$inc: { postCount: 1 },
		});

		res.status(200).redirect("/home");
		// res.status(200).json({ success: true, data: post });
	} catch (err) {
		next(err);
	}
}

async function likePost(req, res, next) {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			res.status(404);
			return next({ message: "Post not found" });
		}
		// * Check if it's already liked then unlike the post
		console.log("Like post");
		console.log(post.likes);
		if (post.likes.includes(req.user._id)) {
			await Post.findByIdAndUpdate(post._id, {
				$pull: { likes: req.user._id },
				$inc: { likeCount: -1 },
			});
		} else {
			await Post.findByIdAndUpdate(post._id, {
				$push: { likes: req.user._id },
				$inc: { likeCount: 1 },
			});
		}

		res.status(200).redirect("/post");
		// res.status(200).json({ success: true, data: false });
	} catch (err) {
		next(err);
	}
}

async function dislikePost(req, res, next) {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			res.status(404);
			return next({ message: "Post not found" });
		}
		// * Check if it's already disliked then un-dislike the post
		if (post.dislikes.includes(req.user._id)) {
			await Post.findByIdAndUpdate(post._id, {
				$pull: { dislikes: req.user._id },
				$inc: { dislikeCount: -1 },
			});
		} else {
			await Post.findByIdAndUpdate(post._id, {
				$push: { dislikes: req.user._id },
				$inc: { dislikeCount: 1 },
			});
		}

		res.status(200).json({ success: true, data: false });
	} catch (err) {
		next(err);
	}
}

async function addComment(req, res, next) {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			res.status(404);
			return next({ message: "Post not found" });
		}
		const { content } = req.body;
		// * Create a comment
		const comment = await Comment.create({
			author: mongoose.Types.ObjectId(req.user._id),
			post: mongoose.Types.ObjectId(req.params.id),
			content,
		});
		// console.log(comment);
		// * Add comment to post
		await Post.findByIdAndUpdate(req.params.id, {
			$push: { comments: mongoose.Types.ObjectId(comment._id) },
			$inc: { commentCount: 1 },
		});

		res.status(200).redirect("/post/" + req.params.id);
		// res.status(200).json({ success: true, data: comment });
	} catch (err) {
		next(err);
	}
}

async function likeComment(req, res, next) {
	try {
		// * Check is post exists
		const post = await Post.findById(req.params.id);
		if (!post) {
			res.status(404);
			return next({ message: "Post not found" });
		}
		// * Check is comment exists
		const comment = await Comment.findById(req.params.commentId);
		if (!comment) {
			res.status(404);
			return next({ message: "Comment not found" });
		}
		// * Check if it's already liked then un-like the post
		if (comment.likes.includes(req.user._id)) {
			await Comment.findByIdAndUpdate(comment._id, {
				$pull: { likes: req.user._id },
				$inc: { likeCount: -1 },
			});
		} else {
			await Comment.findByIdAndUpdate(comment._id, {
				$push: { likes: req.user._id },
				$inc: { likeCount: 1 },
			});
		}

		res.status(200).redirect("/post/" + req.params.id);
		// res.status(200).json({ success: true, data: false });
	} catch (err) {
		next(err);
	}
}

async function dislikeComment(req, res, next) {
	try {
		// * Check is post exists
		const post = Post.findById(req.params.id);
		if (!post) {
			res.status(404);
			return next({ message: "Post not found" });
		}
		// * Check is comment exists
		const comment = Comment.findById(req.params.commentId);
		if (!comment) {
			res.status(404);
			return next({ message: "Comment not found" });
		}
		// * Check if it's already disliked then un-dislike the post
		if (comment.dislikes.includes(req.user._id)) {
			await Comment.findByIdAndUpdate(comment._id, {
				$pull: { dislikes: req.user._id },
				$inc: { dislikeCount: -1 },
			});
		} else {
			await Comment.findByIdAndUpdate(comment._id, {
				$push: { dislikes: req.user._id },
				$inc: { dislikeCount: 1 },
			});
		}

		res.status(200).json({ success: true, data: false });
	} catch (err) {
		next(err);
	}
}

module.exports = {
	getPosts,
	getPost,
	addPost,
	likePost,
	dislikePost,
	addComment,
	likeComment,
	dislikeComment,
	getPostsOfFollowing,
};
