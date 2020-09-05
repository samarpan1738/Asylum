const route = require("express").Router();

route
	.route("/")
	// Get all posts
	.get((req, res, next) => {})
	// Add a post
	.post((req, res, next) => {});

route
	.route("/:id")
	// Get a post with id
	.get((req, res, next) => {});

route
	.route("/:id/like")
	// Like this post
	.get((req, res, next) => {});

route
	.route("/:id/dislike")
	// disLike this post
	.get((req, res, next) => {});

route
	.route("/:id/comments")
	// Get all comments on this post
	.get((req, res, next) => {})
	// Post a comment on this post
	.post((req, res, next) => {});

route
	.route("/:id/comments/:commentId/like")
	// Like this comment
	.get((req, res, next) => {});

route
	.route("/:id/comments/:commentId/dislike")
	// disLike this comment
	.get((req, res, next) => {});

module.exports = route;
