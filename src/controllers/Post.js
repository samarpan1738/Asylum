const { Post } = require("../models/Post");
const { User } = require("../models/User");
const mongoose = require("mongoose");

async function getPosts(req, res, next) {
	try {
		const posts = await Post.find({})
			.populate({ path: "author", select: "username displayPic _id" })
			.populate({ path: "likes", select: "username displayPic _id" })
			.populate({ path: "dislikes", select: "username displayPic _id" })
			.populate({
				path: "comments",
				select: "-post",
				populate: { path: "author", select: "username displayPic _id" },
				populate: { path: "likes", select: "username displayPic _id" },
				populate: { path: "dislikes", select: "username displayPic _id" },
			})
			.lean()
			.exec();
		//  * We need to check which posts are liked/disliked by current user
		if (req.user) {
			posts = posts.map((post) => {
				post.isLiked = false;
				post.isDisliked = false;
				const likes = post.likes.map((like) => like._id);
				post.isLiked = likes.includes(req.user._id);
				const dislikes = post.dislikes.map((dislike) => dislike._id);
				post.isDisliked = dislikes.includes(req.user._id);
				return post;
			});
		}
		// return { success: true, data: posts };
		res.status(200).json({ success: true, data: posts });
	} catch (err) {
		next(err);
		// return { success: false, err };
	}
}

async function getPost(req, res, next) {
	try {
		const post = Post.findById(req.params.id)
			.populate({ path: "author", select: "username displayPic _id" })
			.populate({ path: "likes", select: "username displayPic _id" })
			.populate({ path: "dislikes", select: "username displayPic _id" })
			.populate({
				path: "comments",
				select: "-post",
				populate: { path: "author", select: "username displayPic _id" },
				populate: { path: "likes", select: "username displayPic _id" },
				populate: { path: "dislikes", select: "username displayPic _id" },
			})
			.lean()
			.exec();
		if (!post) {
			res.status(404);
			return next({ message: "Post not found" });
		}
		//  * We need to check some more things like whether this post is liked/disliked by current user
		if (req.user) {
			const likes = post.likes.map((like) => like._id);
			post.isLiked = likes.includes(req.user._id);
			const dislikes = post.dislikes.map((dislike) => dislike._id);
			post.isDisliked = dislikes.includes(req.user._id);
			//  * and is a comment on this post liked or disliked my current user
			const comments = post.comments.map((comment) => {
				comment.isLiked = false;
				comment.isDisliked = false;
				if (comment.likes.author._id == req.user._id) comment.isLiked = true;
				if (comment.dislikes.author._id == req.user._id)
					comment.isDisliked = true;
				return comment;
			});
			post.comments = comments;
			//  * and does this post belong to me
			post.isMine = req.user._id == post.author._id;
		}

		res.status(200).json({ success: true, data: post });
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
		console.log("Current user id ", req.user._id);
		await User.findByIdAndUpdate(req.user._id, {
			$push: { posts: post._id },
			$inc: { postCount: 1 },
		});
		res.status(200).json({ success: true, data: post });
	} catch (err) {
		next(err);
	}
}

async function likePost(req, res, next) {
	try {
		const post = Post.findById(req.params.id);
		if (!post) {
			res.status(404);
			return next({ message: "Post not found" });
		}
		// * Check if it's already liked then unlike the post
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

		res.status(200).json({ success: true, data: false });
	} catch (err) {
		next(err);
	}
}

async function dislikePost(req, res, next) {
	try {
		const post = Post.findById(req.params.id);
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
		const post = Post.findById(req.params.id);
		if (!post) {
			res.status(404);
			return next({ message: "Post not found" });
		}
		const { content } = req.body;
		// * Create a comment
		const comment = Comment.create({
			author: req.user._id,
			post: req.params.id,
			content,
		});

		// * Add comment to post
		await Post.findByIdAndUpdate(req.params.id, {
			$push: { comments: comment._id },
			$inc: { commentCount: 1 },
		});

		res.status(200).json({ success: true, data: comment });
	} catch (err) {
		next(err);
	}
}

async function likeComment(req, res, next) {
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

		res.status(200).json({ success: true, data: false });
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
};
