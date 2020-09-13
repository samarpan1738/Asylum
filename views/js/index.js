let pathArr = window.location.pathname.split("/");
let mapper = {
	post: "explore",
	user: "search",
	home: "home",
	logout: "logout",
};
if (pathArr.length === 3) {
	console.log("Profile nav");
	document.getElementById("nav__profile").classList.toggle("active");
} else {
	console.log(pathArr[1] + " nav");
	if (pathArr[1] == "post")
		document.getElementById("nav__explore").classList.toggle("active");
	else if (pathArr[1] == "user")
		document.getElementById("nav__search").classList.toggle("active");
	else if (pathArr[1] == "messages")
		document.getElementById("nav__message").classList.toggle("active");
	else document.getElementById("nav__" + pathArr[1]).classList.toggle("active");
}
