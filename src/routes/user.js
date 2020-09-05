const route = require("express").Router();
const { getUsers, getUser, follow, unfollow } = require("../controllers/user");
const watchman = require("../helpers/watchman");

route.route("/").get(getUsers);
route.route("/:id").get(getUser);
route.route("/:id/follow").get(watchman, follow);
route.route("/:id/unfollow").get(watchman, unfollow);
// Yet to be changed according to frontend
route.get("/home", (req, res, next) => {});
route.get("/explore", (req, res, next) => {});
route.get("/profile", (req, res, next) => {});

module.exports = route;
