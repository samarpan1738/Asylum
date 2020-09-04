const route = require("express").Router();

route
	.route("/")
	// Get all users
	.get((req, res, next) => {});

route
	.route("/:id")
	// Get this user
	.get((req, res, next) => {});

route
	.route("/:id/follow")
	// Follow this user
	.get((req, res, next) => {});

route
	.route("/:id/follow")
	// unFollow this user
	.get((req, res, next) => {});

route.get("/home", (req, res, next) => {});
route.get("/explore", (req, res, next) => {});
route.get("/profile", (req, res, next) => {});

module.exports = route;
