const route = require("express").Router();

route
	.route("/login")
	.get((req, res, next) => {})
	.post((req, res, next) => {});

route
	.route("/signup")
	.get((req, res, next) => {})
	.post((req, res, next) => {});

module.exports = route;
