function watchman(req, res, next) {
	//  * User is logged in
	if (req.user) {
		next();
	} else {
		res.redirect("/auth/login");
	}
}
module.exports = { watchman };
