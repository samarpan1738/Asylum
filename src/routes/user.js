const route = require("express").Router();
const { getUsers, getUser, follow, unfollow } = require("../controllers/user");
const { watchman } = require("../helpers/watchman");

route.route("/").get(watchman, getUsers);
route.route("/:username").get(watchman, getUser);
route.route("/:username/follow").get(watchman, follow);
route.route("/:username/unfollow").get(watchman, unfollow);
// Yet to be changed according to frontend
// route.get("/home", (req, res, next) => {
// 	res.sendFile("homepage.html");
// });
// route.get("/explore", (req, res, next) => {});
// route.get("/profile", (req, res, next) => {});

module.exports = route;
