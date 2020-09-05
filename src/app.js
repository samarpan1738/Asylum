const express = require("express");
const app = express();
const PORT = process.env.PORT | 2000;
const session = require("express-session");
const { passport } = require("./helpers/passport-config");
const auth = require("./routes/auth");
const user = require("./routes/user");
const post = require("./routes/post");
//Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
	session({
		secret: "shhh",
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
	res.send("Hello");
});

app.use("/auth", auth);
app.use("/user", user);
app.use("/post", post);

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});
