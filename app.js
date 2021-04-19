require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 2000;
const path = require("path");
const session = require("express-session");
const { passport } = require("./helpers/passport-config");
const { connect } = require("./helpers/db");
const auth = require("./routes/auth");
const user = require("./routes/user");
const post = require("./routes/post");
const messages = require("./routes/messages");
const { errorHandler } = require("./helpers/error-handler");
const { watchman } = require("./helpers/watchman");
const { getPostsOfFollowing } = require("./controllers/post");

const hbs = require("hbs");
//Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "views")));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.use(
	session({
		secret: "shhh",
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());

hbs.registerHelper("convert", function (data) {
	if (!data) {
		return;
	}
	return JSON.stringify(data);
});

app.get("/", (req, res) => {
	if (req.user) res.redirect("/home");
	else res.render("auth");
});
// test
app.get("/home", watchman, getPostsOfFollowing);

app.use("/auth", auth);
app.use("/user", user);
app.use("/post", post);
app.use("/messages", messages);
app.get("/logout", (req, res, next) => {
	try {
		req.logout();
		res.status(200).redirect("/");
	} catch (err) {
		next(err);
	}
});
app.use(errorHandler);

connect()
	.then(() => {
		console.log("Connected to DB");
		app.listen(PORT, () => {
			console.log(`Server started at http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		throw new Error("Error connecting to DB");
	});
