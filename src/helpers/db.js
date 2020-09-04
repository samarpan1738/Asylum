const mongoose = require("mongoose");
// const DB_URI = "mongodb://localhost:27017/whatsapp";
const DB_URI =
	"mongodb+srv://root:root@whatsapp.w5wp9.mongodb.net/whatsapp?retryWrites=true&w=majority";

function connect() {
	return mongoose.connect(DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}
function getDb() {
	return mongoose.connection;
}

// db.on("error", (err) => {
//   console.error(err);
// });

module.exports = {
	connect,
	getDb,
};
