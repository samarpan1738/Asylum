const route = require("express").Router();
const { getMessages } = require("../controllers/messages");
const { watchman } = require("../helpers/watchman");

route.route("/").get(watchman, getMessages);

module.exports = route;
