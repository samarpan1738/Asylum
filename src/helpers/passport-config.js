require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
	new LocalStrategy(function (username, password, done) {
		console.log("Inside Local Stat");
		User.findOne({ username })
			.then((user) => {
				// console.log(user);
				if (!user || password != user.password) {
					return done(null, false);
				}

				return done(null, user);
			})
			.catch((err) => {
				done(err, false);
			});
	})
);

passport.serializeUser(function (user, done) {
	console.log("Serializing user " + user.id);
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	console.log("Deserializing user ", id);
	// User.findById(id)
	// 	.then((user) => {
	// 		done(null, user);
	// 	})
	// 	.catch((err) => {
	// 		done(err, false);
	// 	});
});

module.exports = {
	passport,
};
