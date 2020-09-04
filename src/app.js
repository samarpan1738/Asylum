const express = require("express");
const app = express();
const PORT = process.env.PORT | 2000;
const auth = require("./routes/auth");
const user = require("./routes/user");
const post = require("./routes/post");

app.get("/", (req, res) => {
	res.send("Hello");
});

app.use("/auth", auth);
app.use("/user", user);
app.use("/post", post);

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});
