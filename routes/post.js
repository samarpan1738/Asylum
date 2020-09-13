const route = require("express").Router();
const {
	getPosts,
	getPost,
	addPost,
	likePost,
	dislikePost,
	addComment,
	likeComment,
	dislikeComment,
} = require("../controllers/post");
const { watchman } = require("../helpers/watchman");

route.route("/").get(watchman, getPosts).post(watchman, addPost);
route.route("/:id").get(watchman, getPost);
route.route("/:id/like").get(watchman, likePost);
route.route("/:id/comment").post(watchman, addComment);
route.route("/:id/comment/:commentId/like").get(watchman, likeComment);
// route.route("/:id/dislike").get(watchman, dislikePost);
// route.route("/:id/comment/:commentId/dislike").get(watchman, dislikeComment);

module.exports = route;
