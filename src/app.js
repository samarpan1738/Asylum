const express = require("express");
const app = express();
const PORT = process.env.PORT | 2000;

app.get("/", (req, res) => {
	res.send("Hello");
});

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});
