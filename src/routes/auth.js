const route = require("express").Router();
const { passport } = require("../helpers/passport-config");
const { User } = require("../models/User");
const { watchman } = require("../helpers/watchman");
const { reverseWatchman } = require("../helpers/reverse-watchman");
route
	.route("/login")
	.get(reverseWatchman, (req, res, next) => {
		res.render("login");
	})
	.post(
		// * Can't login if already logged in
		reverseWatchman,
		passport.authenticate("local", {
			successRedirect: "/home",
			failureRedirect: "/",
		})
	);

route
	.route("/signup")
	.get(reverseWatchman, (req, res, next) => {
		res.render("signup");
	})
	.post(reverseWatchman, async (req, res, next) => {
		// Create a new user
		const { username, displayName, email, password } = req.body;
		try {
			const user = await User.create({
				displayName,
				username,
				password,
				email,
			});
			// res.status(201).json({ success: true });
			res.redirect("/auth/login");
		} catch (err) {
			next(err);
			// res.status(403).json({success:false});
		}
	});

route.get("/logout", watchman, (req, res, next) => {
	req.logout();
	// res.status(200).json({ success: true });
	res.redirect("/");
});

module.exports = route;
