const route = require("express").Router();
const { passport } = require("../helpers/passport-config");

route.route("/login").post(
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/",
	})
);

route.route("/signup").post(async (req, res, next) => {
	// Create a new user
	const { username, displayName, email, password } = req.body;
	try {
		const user = await User.create({
			displayName,
			username,
			password,
			email,
		});
		res.status(201).json({ success: true });
	} catch (err) {
		next(err);
		// res.status(403).json({success:false});
	}
});

module.exports = route;
