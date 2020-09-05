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

route.route("/").get(getPosts).post(addPost);
route.route("/:id").get(getPost);
route.route("/:id/like").get(likePost);
route.route("/:id/dislike").get(dislikePost);
route.route("/:id/comment").post(addComment);
route.route("/:id/comments/:commentId/like").get(likeComment);
route.route("/:id/comments/:commentId/dislike").get(dislikeComment);

module.exports = route;
