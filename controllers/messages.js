async function getMessages(req, res, next) {
	// TODO: Get messages of req.user
	res.status(200).render("messages");
}
module.exports = {
	getMessages,
};
